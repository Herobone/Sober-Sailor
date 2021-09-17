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
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { DocumentSnapshot, onSnapshot } from "firebase/firestore";
import { Player } from "sobersailor-common/lib/models/Player";
import style from "../../css/TicTacToe.module.scss";
import { TicTacToe as TicTacToeData } from "../../helper/models/TicTacToe";
import { GameManager } from "../../helper/gameManager";
import { firebaseApp } from "../../helper/config";
import { TicOptions, TicUtils } from "./TicUtils";
import { Board } from "./Board";

export function TicTacToe(): JSX.Element {
    const [squares, setSquares] = useState<TicOptions[]>(Array.from({ length: 9 }));
    const [stepNumber, setStepNumber] = useState(0);
    const [isXNext, setIsXNext] = useState(true);
    const [spectator, setSpectator] = useState(true);
    const [player, setPlayer] = useState<TicOptions>(null);
    const [winner, setWinner] = useState<TicOptions | "tie">(null);

    const handleClick = (i: number): void => {
        if (spectator || !player) {
            return;
        }

        if (TicUtils.calculateWinner(squares) || squares[i]) {
            return;
        }

        TicUtils.makeDraw(i, player).catch(console.error);
    };

    const keyEvent = (event: KeyboardEvent): void => {
        const num = Number.parseInt(event.key, 10);
        if (num < 10 && num > 0) handleClick(TicUtils.numpadToSquare(num));
    };

    const updateData = (data: TicTacToeData): void => {
        const user = getAuth(firebaseApp).currentUser;
        if (user) {
            if (user.uid === data.playerX) {
                setPlayer("X");
                setSpectator(false);
            } else if (user.uid === data.playerO) {
                setPlayer("O");
                setSpectator(false);
            }
        } else {
            console.warn("No user provided!");
        }

        setSquares(data.squares);
        setStepNumber(data.stepNumber);
        setIsXNext(data.isXNext);
        setWinner(TicUtils.calculateWinner(data.squares));

        if (winner && !spectator && user && winner !== player) {
            GameManager.submitPenaltyAndReset([
                new Player(user.uid, "", winner === "tie" ? 3 : data.stepNumber, null),
            ]).catch(console.error);
        }
    };

    const updateFromDoc = (doc: DocumentSnapshot<TicTacToeData>): void => {
        const data = doc.data();
        if (!data) {
            throw new Error("No data in Document Snapshot!");
        }
        updateData(data);
    };

    useEffect(() => {
        document.addEventListener("keydown", keyEvent, false);
        const unsubscribe = onSnapshot(TicUtils.getTTTGame(), updateFromDoc);

        return function cleanup() {
            unsubscribe();
            document.removeEventListener("keydown", keyEvent, false);
        };
    }, []);

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
                <Board squares={squares} onClick={(i: number) => handleClick(i)} />
            </div>
            <div className={style.gameInfo}>
                <div>{status}</div>
                <div>Step: {stepNumber}</div>
            </div>
        </div>
    );
}
