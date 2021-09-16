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

import { FormattedMessage } from "react-intl";
import React, { Component } from "react";
import { getAuth } from "firebase/auth";
import { DocumentSnapshot, onSnapshot } from "firebase/firestore";
import { Player } from "sobersailor-common/lib/models/Player";
import style from "../../css/TicTacToe.module.scss";
import { TicTacToe as TicTacToeData } from "../../helper/models/TicTacToe";
import { GameManager } from "../../helper/gameManager";
import { firebaseApp } from "../../helper/config";
import { TicOptions, TicUtils } from "./TicUtils";
import { Board } from "./Board";

interface Props {}
interface State {
    squares: TicOptions[];
    stepNumber: number;
    isXNext: boolean;
    spectator: boolean;
    player: TicOptions;
    winner: TicOptions | "tie";
}

export class TicTacToe extends Component<Props, State> {
    unsubscribe!: () => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            squares: Array.from({ length: 9 }),
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
        this.unsubscribe = onSnapshot(TicUtils.getTTTGame(), this.updateFromDoc);
    }

    componentWillUnmount(): void {
        this.unsubscribe();
        document.removeEventListener("keydown", this.keyEvent, false);
    }

    handleClick(i: number): void {
        if (this.state.spectator || !this.state.player) {
            return;
        }

        const { squares, player } = this.state;
        if (TicUtils.calculateWinner(squares) || squares[i]) {
            return;
        }

        TicUtils.makeDraw(i, player).catch(console.error);
    }

    private updateFromDoc(doc: DocumentSnapshot<TicTacToeData>): void {
        const data = doc.data();
        if (!data) {
            throw new Error("No data in Document Snapshot!");
        }
        this.updateData(data);
    }

    updateData(data: TicTacToeData): void {
        const user = getAuth(firebaseApp).currentUser;
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
            GameManager.submitPenaltyAndReset([
                new Player(user.uid, "", winner === "tie" ? 3 : data.stepNumber, null),
            ]).catch(console.error);
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
        const { squares, stepNumber, player, spectator, isXNext, winner } = this.state;

        const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? "X" : "O"}`;

        return (
            <div className={style.game}>
                {spectator && (
                    <div className="spectator-area">
                        <h2>
                            <FormattedMessage id="elements.general.youare" />{" "}
                            <FormattedMessage id="elements.tictactoe.spectator" />
                        </h2>
                        <br />
                    </div>
                )}
                {!spectator && (
                    <div className="player-area">
                        <h2>
                            <FormattedMessage id="elements.general.youare" /> {player}
                        </h2>
                        <br />
                    </div>
                )}
                <div className={style.boardRow}>
                    <Board squares={squares} onClick={(i: number) => this.handleClick(i)} />
                </div>
                <div className={style.gameInfo}>
                    <div>{status}</div>
                    <div>Step: {stepNumber}</div>
                </div>
            </div>
        );
    }
}
