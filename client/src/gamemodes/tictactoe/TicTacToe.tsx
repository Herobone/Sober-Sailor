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
import React, { Component } from "react";
import { Board } from "./Board";
import "../../css/TicTacToe.css";
import { TicOptions, TicUtils } from "./TicUtils";
import { TicTacToe as TicTacToeData, ticTacToeConverter } from "../../helper/models/TicTacToe";
import { GameManager } from "../../helper/gameManager";

interface Props {
    spectator: boolean;
    player: TicOptions;
}
interface State {
    squares: TicOptions[];
    stepNumber: number;
    isXNext: boolean;
}

export class TicTacToe extends Component<Props, State> {
    unsubscribe: () => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            squares: new Array(9),
            stepNumber: 0,
            isXNext: true,
        };

        this.updateData = this.updateData.bind(this);
        this.updateFromDoc = this.updateFromDoc.bind(this);

        const gameID = GameManager.getGameID();
        const tttRef = firebase.firestore().collection(gameID).doc("tictactoe").withConverter(ticTacToeConverter);
        this.unsubscribe = tttRef.onSnapshot(this.updateFromDoc);
    }

    componentWillUnmount(): void {
        this.unsubscribe();
    }

    handleClick(i: number): void {
        if (this.props.spectator || !this.props.player) {
            throw new Error("Trying to make a draw as spectator");
        }

        const { squares } = this.state;
        if (TicUtils.calculateWinner(squares) || squares[i]) {
            return;
        }

        TicUtils.makeDraw(i, this.props.player).catch(console.error);
    }

    private updateFromDoc(doc: firebase.firestore.DocumentSnapshot<TicTacToeData>): void {
        const data = doc.data();
        if (!data) {
            throw new Error("No data in Document Snapshot!");
        }
        this.updateData(data);
    }

    updateData(data: TicTacToeData): void {
        this.setState({
            squares: data.squares,
            stepNumber: data.stepNumber,
            isXNext: data.isXNext,
        });
    }

    render(): JSX.Element {
        const { squares } = this.state;
        const winner = TicUtils.calculateWinner(squares);

        const status = winner ? `Winner: ${winner}` : `Next player: ${this.state.isXNext ? "X" : "O"}`;

        return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <div
                className="game"
                onKeyPressCapture={(event) => {
                    const num = Number.parseInt(event.key, 10);
                    if (num < 10 && num > 0) this.handleClick(num - 1);
                }}
                role="application"
            >
                <div className="game-board">
                    <Board squares={squares} onClick={(i: number) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>Step: {this.state.stepNumber}</div>
                </div>
            </div>
        );
    }
}
