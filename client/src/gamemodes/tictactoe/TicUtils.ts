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
            console.log(`Player X (${opponents[0]}) plays against Player O (${opponents[1]})`);
            const tttRef = firebase.firestore().collection("tictactoe").doc(gameID).withConverter(ticTacToeConverter);

            tttRef
                .set(new TicTacToe(new Array(9).fill(null), 0, true, opponents[0], opponents[1]))
                .then(resolve)
                .catch(reject);
        });
    }

    static drawAllowed(isXNext: boolean, player: TicOptions): boolean {
        return (!isXNext && player === "O") || (isXNext && player === "X");
    }

    static numpadToSquare(numpad: number): number {
        const reversed = numpad;
        switch (reversed) {
            case 2:
                return 7;
            case 5:
                return 4;
            case 8:
                return 1;
            case 7:
                return 0;
            case 4:
                return 3;
            case 1:
                return 6;
            case 9:
                return 2;
            case 6:
                return 5;
            case 3:
                return 8;
            default:
                throw new RangeError("What kind of numpad do you have?");
        }
    }

    static makeDraw(fieldID: number, player: "X" | "O"): Promise<void> {
        const gameID = GameManager.getGameID();
        return new Promise<void>((resolve, reject) => {
            const tttRef = firebase.firestore().collection("tictactoe").doc(gameID).withConverter(ticTacToeConverter);
            tttRef
                .get({ source: "cache" })
                .then((data) => {
                    const ttt = data.data();
                    if (!ttt) {
                        throw new Error("Data from Game was empty");
                    }
                    return ttt;
                })
                .then((value) => {
                    if (!TicUtils.drawAllowed(value.isXNext, player)) {
                        console.log("Draw not allowed!");
                        resolve();
                        return null;
                    }
                    return value;
                })
                .then((value) => {
                    if (!value) {
                        return null;
                    }
                    const field = value.squares;
                    field[fieldID] = player;
                    return tttRef.update({
                        squares: field,
                        isXNext: !value.isXNext,
                        stepNumber: value.stepNumber + 1,
                    });
                })
                .then(() => resolve())
                .catch(reject);
        });
    }
}
