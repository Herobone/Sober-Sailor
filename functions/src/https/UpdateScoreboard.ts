/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
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

import { GameIDContent } from "sobersailor-common/lib/HostEvents";
import * as functions from "firebase-functions";
import FirestoreUtil from "../helper/FirestoreUtil";
import VerifiedHostExecutor from "../helper/VerifiedHostExecutor";

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
  const { gameData } = await VerifiedHostExecutor.promiseHost(
    data.gameID,
    context
  );

  const players = await FirestoreUtil.getAllPlayers(data.gameID);

  players.forEach((player) => {
    gameData.scoreboard.addScore(player.uid, player.sips);
  });

  await FirestoreUtil.getGame(data.gameID).update({
    scoreboard: gameData.scoreboard.serializeBoard(),
  });
};
