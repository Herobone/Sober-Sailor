/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
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

import firebase from "firebase/app";
import "firebase/firestore";
import { TicOptions } from "../../gamemodes/tictactoe/TicUtils";

export interface ITicTacToe {
    squares: TicOptions[];
    stepNumber: number;
    isXNext: boolean;
    playerX: string;
    playerO: string;
}

export class TicTacToe implements ITicTacToe {
    constructor(
        readonly squares: TicOptions[],
        readonly stepNumber: number,
        readonly isXNext: boolean,
        readonly playerX: string,
        readonly playerO: string,
    ) {}
}

export const ticTacToeConverter = {
    toFirestore(game: TicTacToe): firebase.firestore.DocumentData {
        return {
            squares: game.squares,
            stepNumber: game.stepNumber,
            isXNext: game.isXNext,
            playerX: game.playerX,
            playerO: game.playerO,
        };
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<ITicTacToe>,
        options: firebase.firestore.SnapshotOptions,
    ): TicTacToe {
        const data = snapshot.data(options);
        return new TicTacToe(data.squares, data.stepNumber, data.isXNext, data.playerX, data.playerO);
    },
};
