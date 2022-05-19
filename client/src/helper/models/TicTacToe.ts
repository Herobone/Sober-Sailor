/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
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

import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { ITicTacToe, TicTacToe } from "sobersailor-common/lib/models/TicTacToe";

export const ticTacToeConverter = {
    toFirestore(game: TicTacToe): DocumentData {
        return {
            squares: game.squares,
            stepNumber: game.stepNumber,
            isXNext: game.isXNext,
            playerX: game.playerX,
            playerO: game.playerO,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<ITicTacToe>, options: SnapshotOptions): TicTacToe {
        const data = snapshot.data(options);
        return new TicTacToe(data.squares, data.stepNumber, data.isXNext, data.playerX, data.playerO);
    },
};
