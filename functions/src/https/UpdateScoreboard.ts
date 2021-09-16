import { GameIDContent } from "sobersailor-common/lib/HostEvents";
import * as functions from "firebase-functions";
import FirestoreUtil from "../helper/FirestoreUtil";

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
export const updateScoreboardHandler = async (
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

    players.forEach((player) => {
      gameData.scoreboard.addScore(player.uid, player.sips);
    });

    await FirestoreUtil.getGame(data.gameID).update({
      scoreboard: gameData.scoreboard.serializeBoard(),
    });
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User was not authenticated with firebase while calling this function!"
    );
  }
};
