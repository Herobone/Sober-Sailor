import {
  SingleTargetRequest,
  SingleTargetResult,
} from "../models/SingleTarget";
import FirestoreUtil from "../helper/FirestoreUtil";
import * as functions from "firebase-functions";
import { Player } from "../models/Player";

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

export const singleTargetHandler = async (
  data: SingleTargetRequest,
  context: functions.https.CallableContext
): Promise<SingleTargetResult> => {
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
    if (requestUID !== gameData.taskTarget) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Function must be called by target of the question!"
      );
    }

    const playerData = await FirestoreUtil.getPlayerData(
      data.gameID,
      requestUID
    );
    if (!playerData) {
      throw new functions.https.HttpsError(
        "not-found",
        "Player data was missing!"
      );
    }

    await FirestoreUtil.getGame(data.gameID).update({
      evalState: true,
    });

    await FirestoreUtil.getPlayer(data.gameID, requestUID).set(
      new Player(
        playerData.uid,
        playerData.nickname,
        data.answer ? playerData.sips : playerData.sips + gameData.penalty,
        null
      )
    );

    return { status: "All okay", responseOK: true };
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User was not authenticated with firebase while calling this function!"
    );
  }
};
