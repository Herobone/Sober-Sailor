import * as functions from "firebase-functions";
import FirestoreUtil from "./FirestoreUtil";
import { Player } from "sobersailor-common/lib/models/Player";
import { Game } from "sobersailor-common/lib/models/Game";

/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
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

interface HostData {
  players: Player[];
  gameData: Game;
}

export default class VerifiedHostExecutor {
  static async promiseHost(
    gameID: string,
    context: functions.https.CallableContext
  ): Promise<HostData> {
    const auth = context.auth;
    if (!auth) {
      // Verify if user is even authenticated
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User was not authenticated with firebase while calling this function!"
      );
    }
    console.log("User is authed!");
    const requestUID = auth.uid; // The uuid of the player that called this function
    const gameData = await FirestoreUtil.getGameData(gameID);

    if (!gameData) {
      // Verify if data for this Game exists
      throw new functions.https.HttpsError(
        "not-found",
        "Game data was missing!"
      );
    }
    if (requestUID !== gameData.host) {
      // Verify if the caller is the host
      throw new functions.https.HttpsError(
        "permission-denied",
        "Function must be called by host of game!"
      );
    }
    console.log("User is host");
    const players = await FirestoreUtil.getAllPlayers(gameID);

    return {
      players,
      gameData,
    };
  }
}
