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
import "firebase/auth";
import "firebase/firestore";
import { FormattedMessage } from "react-intl";
import React, { Component } from "react";
import { Board } from "./Board";
import style from "../../css/TicTacToe.module.scss";
import { TicOptions, TicUtils } from "./TicUtils";
import { TicTacToe as TicTacToeData } from "../../helper/models/TicTacToe";
import { GameManager } from "../../helper/gameManager";
import { Player } from "../../helper/models/Player";

interface Props {}
interface State {
    squares: TicOptions[];
    stepNumber: number;
    isXNext: boolean;
    spectator: boolean;
    player: TicOptions;
    winner: TicOptions;
}

export class TicTacToe extends Component<Props, State> {
    unsubscribe!: () => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            squares: new Array(9),
            stepNumber: 0,
            isXNext: true,
            spectator: true,
            player: null,
            winner: null,
        };

        this.updateData = this.updateData.bind(this);
        this.updateFromDoc = this.updateFromDoc.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.keyEvent = this.keyEvent.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener("keydown", this.keyEvent, false);
        this.unsubscribe = TicUtils.getTTTGame().onSnapshot(this.updateFromDoc);
    }

    componentWillUnmount(): void {
        this.unsubscribe();
        document.removeEventListener("keydown", this.keyEvent, false);
    }

    handleClick(i: number): void {
        if (this.state.spectator || !this.state.player) {
            return;
        }

        const { squares } = this.state;
        if (TicUtils.calculateWinner(squares) || squares[i]) {
            return;
        }

        TicUtils.makeDraw(i, this.state.player).catch(console.error);
    }

    private updateFromDoc(doc: firebase.firestore.DocumentSnapshot<TicTacToeData>): void {
        const data = doc.data();
        if (!data) {
            throw new Error("No data in Document Snapshot!");
        }
        this.updateData(data);
    }

    updateData(data: TicTacToeData): void {
        const user = firebase.auth().currentUser;
        let player: TicOptions = null;
        let spectator = true;
        if (user) {
            // console.log(`Player X: ${data.playerX} === ${user.uid} => ${user.uid === data.playerX}`);
            // console.log(`Player O: ${data.playerO} === ${user.uid} => ${user.uid === data.playerO}`);
            if (user.uid === data.playerX) {
                player = "X";
                spectator = false;
            } else if (user.uid === data.playerO) {
                player = "O";
                spectator = false;
            }
        } else {
            console.warn("No user provided!");
        }

        const winner = TicUtils.calculateWinner(data.squares);
        this.setState({
            squares: data.squares,
            stepNumber: data.stepNumber,
            isXNext: data.isXNext,
            player,
            spectator,
            winner,
        });
        if (winner && !spectator && user && winner !== player) {
            GameManager.submitPenaltyAndReset([new Player(user.uid, "", data.stepNumber, null)]);
        }
        // console.log(
        //     `Step Number: ${data.stepNumber} | Is X next: ${data.isXNext} | Player: ${player} | Spectator: ${spectator}`,
        // );
    }

    keyEvent(event: KeyboardEvent): void {
        const num = Number.parseInt(event.key, 10);
        if (num < 10 && num > 0) this.handleClick(TicUtils.numpadToSquare(num));
    }

    render(): JSX.Element {
        const { squares } = this.state;

        const status = this.state.winner
            ? `Winner: ${this.state.winner}`
            : `Next player: ${this.state.isXNext ? "X" : "O"}`;

        return (
            <div className={style.game}>
                {this.state.spectator && (
                    <div className="spectator-area">
                        <h2>
                            <FormattedMessage id="elements.general.youare" />{" "}
                            <FormattedMessage id="elements.tictactoe.spectator" />
                        </h2>
                        <br />
                    </div>
                )}
                {!this.state.spectator && (
                    <div className="player-area">
                        <h2>
                            <FormattedMessage id="elements.general.youare" /> {this.state.player}
                        </h2>
                        <br />
                    </div>
                )}
                <div className={style.boardRow}>
                    <Board squares={squares} onClick={(i: number) => this.handleClick(i)} />
                </div>
                <div className={style.gameInfo}>
                    <div>{status}</div>
                    <div>Step: {this.state.stepNumber}</div>
                </div>
            </div>
        );
    }
}
