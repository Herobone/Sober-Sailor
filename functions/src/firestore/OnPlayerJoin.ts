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
  const gameData = await FirestoreUtil.getGameData(context.params.gameID);
  const playerData = snapshot.data();

  if (!gameData) {
    throw new Error("Data was missing");
  }

  gameData.register.addPlayer(context.params.playerID, playerData.nickname);
  gameData.scoreboard.addScore(context.params.playerID, 0);

  await FirestoreUtil.getGame(context.params.gameID).update({
    scoreboard: gameData.scoreboard.serializeBoard(),
    playerUidMap: gameData.register.serialize(),
  });

  return null;
};
