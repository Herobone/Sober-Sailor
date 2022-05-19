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

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { DocumentSnapshot, onSnapshot } from "firebase/firestore";
import { TicOptions, TicTacToe as TicTacToeData } from "sobersailor-common/lib/models/TicTacToe";
import { TicTacToeUtils } from "sobersailor-common/lib/helpers/TicTacToeUtils";
import Grid from "@mui/material/Grid";
import style from "../../css/TicTacToe.module.scss";
import { GameManager } from "../../helper/gameManager";
import { firebaseApp } from "../../helper/config";
import { useIsHost } from "../../state/actions/gameActions";
import { EvaluateGame, Serverless } from "../../helper/Serverless";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { TicUtils } from "./TicUtils";
import { Board } from "./Board";

export function TicTacToe(): JSX.Element {
    const [squares, setSquares] = useState<TicOptions[]>(Array.from({ length: 9 }));
    const [stepNumber, setStepNumber] = useState(0);
    const [isXNext, setIsXNext] = useState(true);
    const [spectator, setSpectator] = useState(true);
    const [player, setPlayer] = useState<TicOptions>(null);
    const [winner, setWinner] = useState<TicOptions | "tie">(null);

    const [isHost] = useIsHost();

    const handleClick = (i: number): void => {
        if (spectator || !player) {
            return;
        }

        if (TicTacToeUtils.calculateWinner(squares) || squares[i]) {
            return;
        }

        TicUtils.makeDraw(i, player).catch(console.error);
    };

    const keyEvent = (event: KeyboardEvent): void => {
        const num = Number.parseInt(event.key, 10);
        if (num < 10 && num > 0) handleClick(TicUtils.numpadToSquare(num));
    };

    const updateData = async (data: TicTacToeData): Promise<void> => {
        const user = getAuth(firebaseApp).currentUser;
        if (user) {
            if (user.uid === data.playerX) {
                setPlayer("X");
                setSpectator(false);
            } else if (user.uid === data.playerO) {
                setPlayer("O");
                setSpectator(false);
            } else {
                // This line is needed for subsequent games, because the component is not destroyed
                setPlayer(null);
                setSpectator(true);
            }
        } else {
            console.warn("No user provided!");
        }

        setSquares(data.squares);
        setStepNumber(data.stepNumber);
        setIsXNext(data.isXNext);
        setWinner(TicTacToeUtils.calculateWinner(data.squares));
    };

    useEffect(() => {
        if (winner && isHost) {
            const callData: EvaluateGame = {
                gameID: GameManager.getGameID(),
            };
            Serverless.callFunction(Serverless.EVALUATE_GAME)(callData);
        }
    }, [winner]);

    const updateFromDoc = (doc: DocumentSnapshot<TicTacToeData>): void => {
        const data = doc.data();
        if (!data) {
            // When the game is created and the clients try to fetch data, the document might not yet exist
            return;
        }
        updateData(data).catch(console.error);
    };

    useEffect(() => {
        document.addEventListener("keydown", keyEvent, false);
        const unsub = onSnapshot(TicUtils.getTTTGame(), updateFromDoc);

        return function cleanup() {
            unsub();
            document.removeEventListener("keydown", keyEvent, false);
        };
    }, []);

    return (
        <>
            <Grid
                container
                spacing={3}
                sx={{
                    width: 1,
                    margin: 0,
                }}
            >
                {spectator && (
                    <Grid item xs={12}>
                        <h2>
                            <TranslatedMessage id="elements.general.youare" />{" "}
                            <TranslatedMessage id="elements.tictactoe.spectator" />
                        </h2>
                        <br />
                    </Grid>
                )}
                {!spectator && (
                    <Grid item xs={12}>
                        <h2>
                            <TranslatedMessage id="elements.general.youare" /> {player}
                        </h2>
                        <br />
                    </Grid>
                )}
                <Grid item xs={12} sm={9} className={style.game}>
                    {!winner && (
                        <div className={style.boardRow}>
                            <Board squares={squares} onClick={(i: number) => handleClick(i)} />
                        </div>
                    )}
                </Grid>

                <Grid item xs={3} className={style.gameInfo}>
                    <div>Next player: {isXNext ? "X" : "O"}</div>
                    <div>Step: {stepNumber}</div>
                </Grid>

                {winner && <h2>Player {winner} won the game!</h2>}
            </Grid>
        </>
    );
}
