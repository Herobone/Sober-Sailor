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
import { firestore } from "firebase-admin";
import { ITicTacToe, TicTacToe } from "sobersailor-common/lib/models/TicTacToe";

export const ticTacToeConverter: firestore.FirestoreDataConverter<TicTacToe> = {
  toFirestore(game: TicTacToe): firestore.DocumentData {
    return {
      squares: game.squares,
      stepNumber: game.stepNumber,
      isXNext: game.isXNext,
      playerX: game.playerX,
      playerO: game.playerO,
    };
  },
  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot<ITicTacToe>
  ): TicTacToe {
    const data = snapshot.data();
    return new TicTacToe(
      data.squares,
      data.stepNumber,
      data.isXNext,
      data.playerX,
      data.playerO
    );
  },
};
