import * as functions from "firebase-functions";
import FirestoreUtil from "../helper/FirestoreUtil";
import { DescribeInOneWord } from "../models/DescribeInOneWord";

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

export interface NewDIOWRequest {
  word: string;
  target: string;
  gameID: string;
  players: number;
}

export interface NewDIOWResponse {
  writeOK: boolean;
}

export const singleTargetHandler = async (
  data: NewDIOWRequest,
  context: functions.https.CallableContext
): Promise<NewDIOWResponse> => {
  const { auth } = context;
  const { gameID, target, word, players } = data;
  if (auth) {
    //const requestUID = auth.uid;
    await FirestoreUtil.getGameDoc(gameID).update({
      currentTask: null,
      evalState: false,
      pollState: false,
      taskTarget: target,
      type: "describe_in_one_word",
      penalty: 3,
    });

    await FirestoreUtil.getGame(gameID)
      .doc("diow")
      .set(DescribeInOneWord.constructEmptyGame(players, word));

    return { writeOK: true };
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User was not authenticated with firebase while calling this function!"
    );
  }
};
