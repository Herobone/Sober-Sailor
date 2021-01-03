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

export const onPlayerJoinHandler = async (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
) => {
  if (context.params.playerID === "register") {
    // If the created document was a register don't proceed!
    throw new functions.https.HttpsError(
      "ok",
      "Function triggered on register create"
    );
  }

  const registerRef = await FirestoreUtil.getRegisterRef(context.params.gameID);
  const playerData = snapshot.data();

  let playerUid: Map<string, string> = new Map();

  if (registerRef.exists) {
    playerUid = FirestoreUtil.createMap(registerRef);
  }

  playerUid.set(context.params.playerID, playerData.nickname);

  await FirestoreUtil.updateRegister(context.params.gameID, playerUid);

  return null;
};
