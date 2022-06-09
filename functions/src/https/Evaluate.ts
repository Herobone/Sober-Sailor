/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021-2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import FirestoreUtil from "../helper/FirestoreUtil";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GameIDContent } from "sobersailor-common/lib/HostEvents";
import { EvaluationScoreboard } from "sobersailor-common/lib/models/EvaluationScoreboard";
import Util from "sobersailor-common/lib/Util";
import { Game } from "sobersailor-common/lib/models/Game";
import { ticTacToeConverter } from "../models/TicTacToe";
import { TicTacToeUtils } from "sobersailor-common/lib/helpers/TicTacToeUtils";
import VerifiedHostExecutor from "../helper/VerifiedHostExecutor";
import { database } from "firebase-admin";
import { DatabaseGame } from "sobersailor-common/lib/models/DatabaseStructure";
import { TaskType } from "sobersailor-common/lib/gamemodes/tasks";

/**
 * Here we sort out the most popular Answer. If some have the same amount of votes, all are added to the array;
 * @param occurrences A map of occurrences of the answer
 * @return [answers: string[], count: number] answers are those that occurred most often and count is how often it occurred
 */
const getMostPopular = (
  occurrences: Map<string, number>
): [string[], number] => {
  let mostPopularAnswers: string[] = [];
  let mostPopularAnswer: number = 0;
  occurrences.forEach((count: number, answer: string) => {
    if (count > mostPopularAnswer) {
      mostPopularAnswers = [answer];
      mostPopularAnswer = count;
    } else if (count === mostPopularAnswer) {
      mostPopularAnswers.push(answer);
    }
  });
  return [mostPopularAnswers, mostPopularAnswer];
};

const submitChanges = async (
  gameData: Game,
  evaluationScoreboard: EvaluationScoreboard
): Promise<void> => {
  await evaluationScoreboard.board.forEach(async (value, uid) => {
    await FirestoreUtil.getPlayer(gameData.gameID, uid).update({
      sips: admin.firestore.FieldValue.increment(value),
      answer: null,
    });
  });

  await FirestoreUtil.getGame(gameData.gameID).update({
    evaluationScoreboard: evaluationScoreboard.serializeScore(),
    evaluationAnswers: evaluationScoreboard.serializeAnswers(),
    scoreboard: gameData.scoreboard.serializeBoard(),
    pollState: false,
    evalState: true,
  });
};

const evaluateTTT = async (gameData: Game): Promise<void> => {
  const evaluationScoreboard = EvaluationScoreboard.init();
  const tttGameRef = FirestoreUtil.getGame(gameData.gameID)
    .collection("minigames")
    .doc("tictactoe")
    .withConverter(ticTacToeConverter);
  const tttGameDoc = await tttGameRef.get();
  const tttGameData = tttGameDoc.data();
  if (!tttGameData) {
    throw new functions.https.HttpsError(
      "not-found",
      "Data in TicTacToe was missing but the evaluation was called!"
    );
  }
  const winner = TicTacToeUtils.calculateWinner(tttGameData.squares);
  if (winner === "X") {
    // Set Penalty for the loser
    evaluationScoreboard.addScore(tttGameData.playerO, gameData.penalty);
    evaluationScoreboard.addAnswer(tttGameData.playerO, "loser");
    gameData.scoreboard.updateScore(tttGameData.playerO, gameData.penalty);

    // Show who is the winner
    evaluationScoreboard.addScore(tttGameData.playerX, 0);
    evaluationScoreboard.addAnswer(tttGameData.playerX, "winner");
  } else if (winner === "O") {
    // Set Penalty for the loser
    evaluationScoreboard.addScore(tttGameData.playerX, gameData.penalty);
    evaluationScoreboard.addAnswer(tttGameData.playerX, "loser");
    gameData.scoreboard.updateScore(tttGameData.playerX, gameData.penalty);

    // Show who is the winner
    evaluationScoreboard.addScore(tttGameData.playerO, 0);
    evaluationScoreboard.addAnswer(tttGameData.playerO, "winner");
  } else {
    // Divide penalty to both players and set it accordingly
    const penalty = Math.round(gameData.penalty / 2);
    evaluationScoreboard.addScore(tttGameData.playerX, penalty);
    evaluationScoreboard.addAnswer(tttGameData.playerX, "tie");
    gameData.scoreboard.updateScore(tttGameData.playerX, penalty);

    evaluationScoreboard.addScore(tttGameData.playerO, penalty);
    evaluationScoreboard.addAnswer(tttGameData.playerO, "tie");
    gameData.scoreboard.updateScore(tttGameData.playerO, penalty);
  }
  await submitChanges(gameData, evaluationScoreboard);
};

export const evaluateGameHandler = async (
  data: GameIDContent,
  context: functions.https.CallableContext
) => {
  const { gameData } = await VerifiedHostExecutor.promiseHost(
    data.gameID,
    context
  );

  if (gameData.type === TaskType.TIC_TAC_TOE) {
    return evaluateTTT(gameData);
  }

  const db = database();
  const gameDataDB: DatabaseGame = (await db.ref(data.gameID).get()).val();
  const users = Util.objToMap(gameDataDB.users);

  const answers: string[] = [];
  const evaluationScoreboard = EvaluationScoreboard.init();
  for (const [uid, player] of users) {
    if (player.onlineState) {
      answers.push(
        player.answer ||
          (gameData.type === TaskType.WHO_WOULD_RATHER ? uid : "none")
      );

      evaluationScoreboard.addAnswer(uid, player.answer || "none");
    }
  }

  const occur = Util.countOccurrences(answers);
  if (gameData.type === TaskType.WOULD_YOU_RATHER) {
    const [popularAnswers, count] = getMostPopular(occur);
    for (const [uid, player] of users) {
      if (popularAnswers.includes(player.answer || "none")) {
        evaluationScoreboard.addScore(uid, count);
        gameData.scoreboard.updateScore(uid, count);
      }
    }
  } else {
    occur.forEach((count, uid) => {
      if (uid === "none") {
        return;
      }
      evaluationScoreboard.addScore(uid, count);
      gameData.scoreboard.updateScore(uid, count);
    });
  }

  for (const [uid] of users) {
    if (!evaluationScoreboard.board.has(uid)) {
      evaluationScoreboard.addScore(uid, 0);
    }

    await db.ref(gameData.gameID + "/users/" + uid + "/answer").set(null);
  }

  await submitChanges(gameData, evaluationScoreboard);
};
