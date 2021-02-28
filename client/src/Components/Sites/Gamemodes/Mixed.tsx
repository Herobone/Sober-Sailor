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

import React, { ElementRef, ReactElement, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase/app";
import "firebase/firestore";
import Cookies from "universal-cookie";

import { Tooltip } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Zoom from "@material-ui/core/Zoom";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import IconButton from "@material-ui/core/IconButton";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import PollIcon from "@material-ui/icons/Poll";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import { GameManager } from "../../../helper/gameManager";
import { Util } from "../../../helper/Util";
import { Leaderboard } from "../../Visuals/Leaderboard";
import { WhoWouldRather } from "../../../gamemodes/WhoWouldRather";
import tasks from "../../../gamemodes/tasks.json";
import { TaskUtils } from "../../../helper/TaskUtils";
import { TruthOrDare } from "../../../gamemodes/TruthOrDare";
import { Player } from "../../../helper/models/Player";
import { ResultPage } from "../../Visuals/ResultPage";
import { Game } from "../../../helper/models/Game";
import { Task } from "../../../helper/models/task";
import { KickList } from "../../Visuals/KickList";
import { TicUtils } from "../../../gamemodes/tictactoe/TicUtils";
import { PlayerList } from "../../../helper/models/CustomTypes";
import { TicTacToe } from "../../../gamemodes/tictactoe/TicTacToe";
import { useDefaultStyles } from "../../../css/Style";

type LeaderboardHandle = ElementRef<typeof Leaderboard>;
type TruthOrDareHandle = ElementRef<typeof TruthOrDare>;
type KickListHandle = ElementRef<typeof KickList>;
type WhoWouldRatherHandle = ElementRef<typeof WhoWouldRather>;

export function Mixed(): JSX.Element {
    const leaderboardRef = useRef<LeaderboardHandle>(null);

    const taskRef = useRef<WhoWouldRatherHandle>(null);

    const truthOrDareRef = useRef<TruthOrDareHandle>(null);

    const kickListRef = useRef<KickListHandle>(null);

    const cookies = new Cookies();
    const lang: string = cookies.get("locale");

    const classes = useDefaultStyles();

    const [nextTask, setNextTask] = useState<string>();
    const [taskType, setTaskType] = useState<string>();
    const [target, setTarget] = useState<string>();
    const [isHost, setIsHost] = useState<boolean>(false);
    const [pollState, setPollState] = useState(false);
    const [evalState, setEvalState] = useState(false);
    const [result, setResult] = useState<Player[] | null>(null);
    const [countdownTimeout, setCountdownTimeout] = useState<NodeJS.Timeout>();
    const [timer, setTimer] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [penalty, setPenalty] = useState(0);

    const updateLeaderboard = (): void => {
        const lb = leaderboardRef.current;
        if (lb) {
            lb.updateLeaderboard();
        }
    };

    const submitAndReset = (): void => {
        const resultsWere = result;
        if (resultsWere) {
            GameManager.submitPenaltyAndReset(resultsWere)
                .then(() => {
                    setResult(null);

                    return updateLeaderboard();
                })
                .catch(console.error);
        } else {
            updateLeaderboard();
        }
        const tud = truthOrDareRef.current;
        if (tud) {
            tud.reset();
        }
    };

    const startTimer = (duration: number): void => {
        let localTimer = duration;
        setMaxTime(duration);
        const timeout = setInterval(() => {
            setTimer(localTimer);

            if (--localTimer < 0) {
                if (countdownTimeout) {
                    clearTimeout(countdownTimeout);
                }
                setPollState(false);

                if (isHost) {
                    GameManager.setPollState(false).catch(console.error);
                    GameManager.setEvalState(true).catch(console.error);
                }
            }
        }, 1000);
        setCountdownTimeout(timeout);
    };

    const gameEvent = (doc: firebase.firestore.DocumentSnapshot<Game>): void => {
        const data = doc.data();
        if (data) {
            GameManager.updatePlayerLookupTable(doc);
            // this.updateLeaderboard();

            if (nextTask !== data.currentTask || taskType !== data.type || target !== data.taskTarget) {
                submitAndReset();
                setNextTask(data.currentTask ? data.currentTask : data.type || undefined);
                setTaskType(data.type || undefined);
                setTarget(data.taskTarget || undefined);
                setPenalty(data.penalty);
            }
            if (!pollState && data.pollState) {
                startTimer(20);
                setPollState(true);
                if (taskRef.current) {
                    taskRef.current.lockInput(false);
                }
            }

            if (!evalState && data.evalState) {
                setEvalState(true);
                if (taskType === "truthordare") {
                    updateLeaderboard();
                } else {
                    GameManager.evaluateAnswers().then(setResult).catch(console.error);
                }
            }

            if (!data.evalState) {
                setEvalState(false);
            }

            if (!data.pollState && taskRef.current) {
                taskRef.current.lockInput(true);
            }
        }
    };

    useEffect((): void => {
        GameManager.joinGame(gameEvent).then(updateLeaderboard).catch(console.error);
        GameManager.amIHost().then(setIsHost).catch(console.error);
    }, []);

    const setTask = (type: Task, newTarget: PlayerList, newPenalty = 0): void => {
        console.log({ task: type, target: newTarget, penalty: newPenalty });
        if (type.id === "tictactoe") {
            GameManager.getGame()
                .update({
                    currentTask: null,
                    type: type.id,
                    evalState: false,
                    pollState: false,
                    taskTarget: null,
                    penalty: newPenalty,
                })
                .catch(console.error);
            if (newTarget && newTarget.length === 2) {
                TicUtils.registerTicTacToe(newTarget).catch(console.error);
            }
        } else {
            const taskLang = lang in type.lang ? lang : type.lang[0];
            const localTarget = newTarget ? newTarget[0] : null;

            TaskUtils.getRandomTask(type.id, taskLang)
                .then(
                    (task): Promise<void> => {
                        setNextTask(task);
                        return GameManager.getGame().update({
                            currentTask: task,
                            type: type.id,
                            evalState: false,
                            pollState: false,
                            taskTarget: localTarget,
                            penalty: newPenalty,
                        });
                    },
                )
                .catch(console.error);
        }
    };

    const randomButtonClick = (): void => {
        if (!isHost) {
            throw new Error("Trying to execute a host method as non Host");
        }
        submitAndReset();
        const testMode = false;
        const development = process.env.NODE_ENV === "development" && testMode;
        const nextTaskType: Task = development ? tasks[3] : Util.selectRandom(tasks);

        if (nextTaskType.singleTarget) {
            let targetCount = 1;
            if (nextTaskType.id === "tictactoe") {
                targetCount = 2;
            }
            const nextTarget = GameManager.getRandomPlayer(targetCount);
            setTask(nextTaskType, nextTarget, Util.random(3, 7));
        } else {
            setTask(nextTaskType, null);
        }
    };

    let taskComponent: ReactElement = <FormattedMessage id="elements.tasks.notloaded" />;

    if (nextTask && taskType) {
        switch (taskType) {
            case "whowouldrather": {
                taskComponent = <WhoWouldRather question={nextTask} ref={taskRef} />;
                break;
            }
            case "truthordare": {
                if (target) {
                    taskComponent = (
                        <TruthOrDare ref={truthOrDareRef} question={nextTask} target={target} penalty={penalty} />
                    );
                }
                break;
            }
            case "tictactoe": {
                console.log("TicTacToe");
                taskComponent = <TicTacToe />;
                break;
            }
            default: {
                console.error("Unexpected task type!");
            }
        }
    }

    return (
        <>
            <Grid container spacing={3} className={classes.mainGrid}>
                <Grid item xs={10} md={6}>
                    <div className={classes.mainHeadingName}>
                        <FormattedMessage id="sobersailor.name" />
                    </div>
                </Grid>
                {timer !== 0 && (
                    <Grid item xs={12}>
                        <span className="countdown-inner">{timer}</span> <FormattedMessage id="general.seconds" />
                        <LinearProgress variant="determinate" value={(timer / maxTime) * 100} />
                    </Grid>
                )}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper>
                        {taskComponent}

                        <ResultPage result={result || undefined} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    {isHost && (
                        <Paper className={classes.sideArea}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <h2 className={classes.sideHeading}>
                                        <FormattedMessage id="elements.admin.control" />
                                    </h2>
                                </Grid>
                                {!pollState && (
                                    <Grid item xs className={classes.controlButton}>
                                        <Tooltip
                                            title={<FormattedMessage id="actions.host.nextquestion" />}
                                            TransitionComponent={Zoom}
                                            placement="bottom"
                                            arrow
                                        >
                                            <IconButton
                                                color="primary"
                                                className={classes.hostButton}
                                                onClick={randomButtonClick}
                                            >
                                                <QueuePlayNextIcon className={classes.controlButtonIcon} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )}
                                <Grid item xs className={classes.controlButton}>
                                    <Tooltip
                                        title={<FormattedMessage id="actions.host.transfer" />}
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
                                        >
                                            <TransferWithinAStationIcon className={classes.controlButtonIcon} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                {!pollState && (
                                    <Grid item xs className={classes.controlButton}>
                                        <Tooltip
                                            title={<FormattedMessage id="actions.host.startpoll" />}
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
                                            >
                                                <PollIcon className={classes.controlButtonIcon} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )}
                                <Grid item xs className={classes.controlButton}>
                                    <Tooltip
                                        title={<FormattedMessage id="actions.host.kick" />}
                                        TransitionComponent={Zoom}
                                        placement="bottom"
                                        arrow
                                    >
                                        <IconButton
                                            color="primary"
                                            className={classes.hostButton}
                                            onClick={() => {
                                                const klRef = kickListRef.current;
                                                if (klRef) {
                                                    klRef.show();
                                                }
                                            }}
                                        >
                                            <FlightTakeoffIcon className={classes.controlButtonIcon} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                    <Leaderboard ref={leaderboardRef} />
                    <KickList ref={kickListRef} />
                </Grid>
            </Grid>
        </>
    );
}
