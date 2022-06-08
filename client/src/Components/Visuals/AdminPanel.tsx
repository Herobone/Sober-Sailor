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
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import IconButton from "@mui/material/IconButton";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PollIcon from "@mui/icons-material/Poll";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import { TaskType } from "sobersailor-common/lib/gamemodes/tasks";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { GameManager } from "../../helper/gameManager";
import { EvaluateGame, Serverless } from "../../helper/Serverless";
import { useIsHost, usePlayersReady } from "../../state/actions/gameActions";
import { useResult } from "../../state/actions/resultActions";
import { useDefaultStyles } from "../../style/Style";
import { useEvalState, usePollState } from "../../state/actions/displayStateActions";
import { useTaskType } from "../../state/actions/taskActions";

export function AdminPanel(): JSX.Element {
    const classes = useDefaultStyles();
    const [isHost] = useIsHost();

    const setPlayersReady = usePlayersReady()[1];
    const [taskType] = useTaskType();
    const [result, setResult] = useResult();
    const [pollState] = usePollState();
    const [evalState] = useEvalState();

    const [votable, setVotable] = useState(false);

    const submitAndReset = (): void => {
        console.log("Results are", result);
        setPlayersReady([]);
        setResult(null);
    };

    const nextTaskButtonClick = (): void => {
        if (!isHost) {
            throw new Error("Trying to execute a host method as non Host");
        }
        submitAndReset();

        const callData: EvaluateGame = {
            gameID: GameManager.getGameID(),
        };

        Serverless.callFunction(Serverless.NEXT_TASK)(callData);
    };

    useEffect(() => {
        switch (taskType) {
            case TaskType.WHO_WOULD_RATHER:
                setVotable(true);
                break;
            case TaskType.TRUTH_OR_DARE:
                setVotable(false);
                break;
            case TaskType.TIC_TAC_TOE:
                setVotable(false);
                break;
            case TaskType.WOULD_YOU_RATHER:
                setVotable(true);
                break;
            case undefined:
                setVotable(false);
                break;
            default:
                setVotable(false);
                break;
        }
    }, [taskType]);

    return (
        <Paper className={classes.sideArea}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <h2 className={classes.sideHeading}>
                        <TranslatedMessage id="elements.admin.control" />
                    </h2>
                </Grid>
                {!pollState && (
                    <Grid item xs className={classes.controlButton}>
                        <Tooltip
                            title={<TranslatedMessage id="actions.host.nextquestion" />}
                            TransitionComponent={Zoom}
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                color="primary"
                                className={classes.hostButton}
                                onClick={nextTaskButtonClick}
                                size="large"
                            >
                                <QueuePlayNextIcon className={classes.controlButtonIcon} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
                <Grid item xs className={classes.controlButton}>
                    <Tooltip
                        title={<TranslatedMessage id="actions.host.transfer" />}
                        TransitionComponent={Zoom}
                        placement="bottom"
                        arrow
                    >
                        <IconButton
                            color="primary"
                            className={classes.hostButton}
                            onClick={() => {
                                GameManager.transferHostShip().catch(console.error);
                            }}
                            size="large"
                        >
                            <TransferWithinAStationIcon className={classes.controlButtonIcon} />
                        </IconButton>
                    </Tooltip>
                </Grid>
                {!pollState && votable && !evalState && (
                    <Grid item xs className={classes.controlButton}>
                        <Tooltip
                            title={<TranslatedMessage id="actions.host.startpoll" />}
                            TransitionComponent={Zoom}
                            placement="bottom"
                            arrow
                        >
                            <IconButton
                                color="primary"
                                className={classes.hostButton}
                                onClick={() => {
                                    GameManager.setPollState(true).catch(console.error);
                                }}
                                size="large"
                            >
                                <PollIcon className={classes.controlButtonIcon} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
                <Grid item xs className={classes.controlButton}>
                    <Tooltip
                        title={<TranslatedMessage id="actions.host.kick" />}
                        TransitionComponent={Zoom}
                        placement="bottom"
                        arrow
                    >
                        <IconButton
                            color="primary"
                            className={classes.hostButton}
                            onClick={() => {
                                /*const klRef = kickListRef.current;
                                if (klRef) {
                                    klRef.show();
                                }*/
                                console.warn("Kick list not working currently");
                            }}
                            size="large"
                        >
                            <FlightTakeoffIcon className={classes.controlButtonIcon} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
}
