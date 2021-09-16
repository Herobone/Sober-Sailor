/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import FirestoreUtil from "../helper/FirestoreUtil";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GameIDContent } from "sobersailor-common/src/HostEvents";
import { EvaluationScoreboard } from "sobersailor-common/src/models/EvaluationScoreboard";
import { Player } from "sobersailor-common/src/models/Player";
import Util from "sobersailor-common/src/Util";

/**
 * Here we sort out the most popular Answer. If some have the same amount of votes, all are added to the array;
 * @param occurrences A map of occurrences of the answer
 * @return [answers: string[], count: number] answers are those that occurred most often and count is how often it occurred
 */
const getMostPopular = (occurrences: Map<string, number>) => {
  let mostPoluarAnswers: string[] = [];
  let mostPoluarAnswer: number = 0;
  occurrences.forEach((count: number, answer: string) => {
    if (count > mostPoluarAnswer) {
      mostPoluarAnswers = [answer];
      mostPoluarAnswer = count;
    } else if (count === mostPoluarAnswer) {
      mostPoluarAnswers.push(answer);
    }
  });
  return [mostPoluarAnswers, mostPoluarAnswer];
};

export const evaluateGameHandler = async (
  data: GameIDContent,
  context: functions.https.CallableContext
) => {
  const auth = context.auth;
  if (auth) {
    const requestUID = auth.uid;
    const gameData = await FirestoreUtil.getGameData(data.gameID);

    if (!gameData) {
      throw new functions.https.HttpsError(
        "not-found",
        "Game data was missing!"
      );
    }
    if (requestUID !== gameData.host) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Function must be called by host of game!"
      );
    }
    const players = await FirestoreUtil.getAllPlayers(data.gameID);
    const answers: string[] = [];
    const scoreboard = EvaluationScoreboard.init();
    players.forEach((player: Player) => {
      if (player.answer) {
        answers.push(player.answer);
        scoreboard.addAnswer(player.uid, player.answer);
      } else {
        answers.push(player.uid);
        scoreboard.addAnswer(player.uid, "none");
      }
    });
    const occur = Util.countOccurrences(answers);
    if (gameData.type === "wouldyourather") {
      // @ts-ignore
      const [popularAnswers, count] = getMostPopular(occur);
    } else {
      occur.forEach((value, uid) => {
        scoreboard.addScore(uid, value);
        gameData.scoreboard.updateScore(uid, value);
      });
      players.forEach((player) => {
        if (!scoreboard.board.has(player.uid)) {
          scoreboard.addScore(player.uid, 0);
        }
      });
    }

    await scoreboard.board.forEach(async (value, key) => {
      await FirestoreUtil.getPlayer(data.gameID, key).update({
        sips: admin.firestore.FieldValue.increment(value),
        answer: null,
      });
    });

    await FirestoreUtil.getGame(data.gameID).update({
      evaluationScoreboard: scoreboard.serializeScore(),
      evaluationAnswers: scoreboard.serializeAnswers(),
      scoreboard: gameData.scoreboard.serializeBoard(),
      pollState: false,
      evalState: true,
    });
  }
};
