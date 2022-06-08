/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
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
import LinearProgress from "@mui/material/LinearProgress";
import { EvaluateGame, Serverless } from "../../helper/Serverless";
import { GameManager } from "../../helper/gameManager";
import { useIsHost, usePlayersOnline, usePlayersReady } from "../../state/actions/gameActions";
import { usePollState } from "../../state/actions/displayStateActions";
import { TranslatedMessage } from "../../translations/TranslatedMessage";

export function Timer(): JSX.Element {
    const [isHost] = useIsHost();
    const [pollState, setPollState] = usePollState();
    const [timer, setTimer] = useState(0);
    const [maxTime, setMaxTime] = useState(0);

    const [playersOnline] = usePlayersOnline();
    const [playersReady] = usePlayersReady();
    const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timer>();

    const stopTimer = (): void => {
        if (!pollState) return;
        console.log("Stopping timer!");
        if (intervalTimer) {
            console.log("Clearing Timeout");
            clearTimeout(intervalTimer); // stop the timeout so it does not get negative
        }
        setTimer(0);
        setPollState(false); // set poll state to false

        if (isHost) {
            console.log("Publishing new states");
            const callData: EvaluateGame = {
                gameID: GameManager.getGameID(),
            };
            Serverless.callFunction(Serverless.EVALUATE_GAME)(callData);
        }
    };

    const startTimer = (duration: number): void => {
        let localTimer = duration; // create a local copy that will be decremented
        setMaxTime(duration); // set the state, so we can calculate the with of the bar
        console.log(`Starting Timer with ${duration}s`);
        const timeout = setInterval(
            () => {
                setTimer(localTimer);

                if (--localTimer < 0) {
                    stopTimer();
                }
            },
            1000, // run every 1 second
        );
        setIntervalTimer(timeout);
    };

    useEffect(() => {
        console.log("Players changed their answers!");
        let internalReady = true;
        for (const uid of playersOnline) {
            internalReady = internalReady && playersReady.includes(uid);
            console.log("Player " + uid + " has answered: " + playersReady.includes(uid));
        }
        if (internalReady) {
            stopTimer();
            console.log("All players answered!");
        }
    }, [playersReady]);

    useEffect(() => {
        if (pollState && timer === 0) {
            startTimer(20);
        }
    }, [pollState]);

    return (
        <>
            <span className="countdown-inner">{timer}</span> <TranslatedMessage id="general.seconds" />
            <LinearProgress variant="determinate" value={(timer / maxTime) * 100} />
        </>
    );
}
