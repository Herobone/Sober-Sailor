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
import firebase from "firebase";
import { GameManager } from "../../helper/gameManager";
import { TicTacToe, ticTacToeConverter } from "../../helper/models/TicTacToe";

export type TicOptions = "X" | "O" | null;

export class TicUtils {
    static calculateWinner(squares: TicOptions[]): TicOptions {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        let winner: TicOptions = null;
        lines.forEach((line: number[]) => {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                winner = squares[a];
            }
        });
        return winner;
    }

    static registerTicTacToe(opponents: string[]): Promise<unknown> {
        const gameID = GameManager.getGameID();
        return new Promise<unknown>((resolve, reject) => {
            if (opponents.length !== 2) {
                throw new RangeError("More or less than two players specified!");
            }
            const tttRef = firebase.firestore().collection(gameID).doc("tictactoe").withConverter(ticTacToeConverter);
            tttRef
                .set(new TicTacToe(new Array(9), 0, true, opponents[0], opponents[1]))
                .then(resolve)
                .catch(reject);
        });
    }

    static makeDraw(fieldID: number, player: "X" | "O"): Promise<unknown> {
        const gameID = GameManager.getGameID();
        return new Promise<unknown>((resolve, reject) => {
            const tttRef = firebase.firestore().collection(gameID).doc("tictactoe").withConverter(ticTacToeConverter);
            tttRef
                .get({ source: "cache" })
                .then((data) => {
                    const ttt = data.data();
                    if (!ttt) {
                        throw new Error("Data from Game was empty");
                    }
                    return ttt.squares;
                })
                .then((value) => {
                    const field = value;
                    field[fieldID] = player;
                    return tttRef.update({
                        squares: field,
                    });
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
