import * as functions from "firebase-functions";
import FirestoreUtil from "../helper/FirestoreUtil";
import { KickPlayer } from "@herobone/sobersailor-common/lib/HostEvents";

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

export const kickPlayerHandler = async (
  data: KickPlayer,
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

    await FirestoreUtil.getPlayer(data.gameID, data.playerID).delete();

    gameData.register.removePlayer(data.playerID);

    await FirestoreUtil.updateRegister(data.gameID, gameData);
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User was not authenticated with firebase while calling this function!"
    );
  }
};
