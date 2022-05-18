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
import { TicOptions, TicTacToe } from "sobersailor-common/lib/models/TicTacToe";
import * as admin from "firebase-admin";
import FirestoreUtil from "./FirestoreUtil";
import { ticTacToeConverter } from "../models/TicTacToe";
import { Game } from "sobersailor-common/lib/models/Game";

export const TicUtils = {
  async registerTicTacToe(
    opponents: string[],
    gameData: Game
  ): Promise<FirebaseFirestore.WriteResult> {
    return TicUtils.getTTTGame(gameData).set(
      new TicTacToe(
        Array.from<TicOptions>({ length: 9 }).fill(null),
        0,
        true,
        opponents[0],
        opponents[1]
      )
    );
  },
  getTTTGame(gameData: Game): admin.firestore.DocumentReference<TicTacToe> {
    return FirestoreUtil.getGame(gameData.gameID)
      .collection("minigames")
      .doc("tictactoe")
      .withConverter(ticTacToeConverter);
  },
};
