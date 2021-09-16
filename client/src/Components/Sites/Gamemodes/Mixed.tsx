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
import { DocumentSnapshot, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
import { Player } from "@herobone/sobersailor-common/lib/models/Player";
import { Game } from "@herobone/sobersailor-common/lib/models/Game";
import { Task } from "@herobone/sobersailor-common/lib/models/Task";
import Util from "@herobone/sobersailor-common/lib/Util";
import { firebaseApp } from "../../../helper/config";
import { GameManager } from "../../../helper/gameManager";
import { Leaderboard } from "../../Visuals/Leaderboard";
import { WhoWouldRather } from "../../../gamemodes/WhoWouldRather";
import tasks from "../../../gamemodes/tasks.json";
import { TaskUtils } from "../../../helper/TaskUtils";
import { TruthOrDare } from "../../../gamemodes/TruthOrDare";
import { ResultPage } from "../../Visuals/ResultPage";
import { KickList } from "../../Visuals/KickList";
import { TicUtils } from "../../../gamemodes/tictactoe/TicUtils";
import { PlayerList } from "../../../helper/models/CustomTypes";
import { TicTacToe } from "../../../gamemodes/tictactoe/TicTacToe";
import { useDefaultStyles } from "../../../css/Style";
import { usePenalty, useTarget, useTask, useTaskType } from "../../../state/actions/taskActions";
import { useResult } from "../../../state/actions/resultActions";
import { useIsHost } from "../../../state/actions/gameActions";
import { useEvalState, usePollState } from "../../../state/actions/displayStateActions";
import { EvaluateGame, Serverless } from "../../../helper/Serverless";
import { useScoreboard } from "../../../state/actions/scoreboardAction";

type TruthOrDareHandle = ElementRef<typeof TruthOrDare>;
type KickListHandle = ElementRef<typeof KickList>;

// Default export needed here for being able to lazy load it
// eslint-disable-next-line import/no-default-export
export default function Mixed(): JSX.Element {
    const truthOrDareRef = useRef<TruthOrDareHandle>(null);

    const kickListRef = useRef<KickListHandle>(null);

    const cookies = new Cookies();
    const lang: string = cookies.get("locale");

    const classes = useDefaultStyles();

    const [taskType, setTaskType] = useTaskType();
    const [target, setTarget] = useTarget();
    const [nextTask, setNextTask] = useTask();
    const [isHost, setHost] = useIsHost();
    const [pollState, setPollState] = usePollState();
    const [evalState, setEvalState] = useEvalState();
    const [result, setResult] = useResult();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [penalty, setPenalty] = usePenalty();

    const setScoreboard = useScoreboard()[1];

    const [timer, setTimer] = useState(0);
    const [maxTime, setMaxTime] = useState(0);

    const submitAndReset = (): void => {
        console.log("Results are", result);
        if (result !== null) {
            setResult(null);
        }
        const tud = truthOrDareRef.current;
        if (tud) {
            tud.reset();
        }
    };

    const startTimer = (duration: number): void => {
        let localTimer = duration; // create a local copy that will be decremented
        setMaxTime(duration); // set the state so we can calculate the with of the bar
        console.log(`Starting Timer with ${duration}s`);
        const timeout = setInterval(
            (horst: boolean) => {
                setTimer(localTimer);

                if (--localTimer < 0) {
                    console.log("Stopping timer!");
                    if (timeout) {
                        console.log("Clearing Timeout");
                        clearTimeout(timeout); // stop the timeout so it does not get negative
                    }
                    setPollState(false); // set poll state to false

                    if (horst) {
                        console.log("Publishing new states");
                        const callData: EvaluateGame = {
                            gameID: GameManager.getGameID(),
                        };
                        Serverless.callFunction(Serverless.EVALUATE_GAME)(callData);
                    }
                }
            },
            1000, // run every 1 second
            isHost, // passing is host in here solves the issue with it being undefined inside the function
        );
    };

    useEffect(() => {
        if (pollState && timer === 0) {
            startTimer(20);
        }
    }, [pollState]);

    useEffect(() => {
        if (!evalState) {
            setResult(null);
        }
    }, [evalState]);

    const gameEvent = (doc: DocumentSnapshot<Game>): void => {
        const data = doc.data();
        if (data) {
            GameManager.updatePlayerLookupTable(doc);
            console.log("Received data from Firestore!");

            if (nextTask !== data.currentTask || taskType !== data.type || target !== data.taskTarget) {
                submitAndReset();
                setNextTask(data.currentTask ? data.currentTask : data.type || undefined);
                setTaskType(data.type || undefined);
                setTarget(data.taskTarget || undefined);
                setPenalty(data.penalty);
            }

            setPollState(data.pollState);

            setEvalState(data.evalState);

            setScoreboard(data.scoreboard);

            if (data.evalState) {
                const resultData: Player[] = [];
                const plt = GameManager.getPlayerLookupTable();
                if (!plt) {
                    throw new Error("PLT was missing. Why is it missing?");
                }

                data.evaluationScoreboard.board.forEach((score: number, uid: string) => {
                    const answer = data.evaluationScoreboard.answers.get(uid) || "none";
                    let readableAnswer = "Error Answer";
                    if (data.type === "wouldyourather") {
                        console.warn("Not implemented jet");
                    } else {
                        readableAnswer = plt.playerUidMap.get(answer) || "Forgot to Answer";
                    }
                    resultData.push(new Player(uid, plt.playerUidMap.get(uid) || "Error Name", score, readableAnswer));
                });

                setResult(resultData);
            }

            const auth = getAuth(firebaseApp);
            const user = auth.currentUser;

            setHost(user !== null && data.host === user.uid);
        }
    };

    /// This code will get executed on loading of the page
    useEffect((): void => {
        GameManager.joinGame(gameEvent).then(GameManager.amIHost).then(setHost).catch(console.error);
    }, []);

    const setTask = (type: Task, newTarget: PlayerList, newPenalty = 0): void => {
        console.log({ task: type, target: newTarget, penalty: newPenalty });
        if (type.id === "tictactoe") {
            updateDoc(GameManager.getGame(), {
                currentTask: null,
                type: type.id,
                evalState: false,
                pollState: false,
                taskTarget: null,
                penalty: newPenalty,
            }).catch(console.error);
            if (newTarget && newTarget.length === 2) {
                TicUtils.registerTicTacToe(newTarget).catch(console.error);
            }
        } else {
            const taskLang = lang in type.lang ? lang : type.lang[0];
            const localTarget = newTarget ? newTarget[0] : null;

            TaskUtils.getRandomTask(type.id, taskLang)
                .then((task): Promise<void> => {
                    setNextTask(task);
                    return updateDoc(GameManager.getGame(), {
                        currentTask: task,
                        type: type.id,
                        evalState: false,
                        pollState: false,
                        taskTarget: localTarget,
                        penalty: newPenalty,
                    });
                })
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
        const nextTaskType: Task = development ? tasks[2] : Util.selectRandom(tasks);

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
                taskComponent = <WhoWouldRather />;
                break;
            }
            case "truthordare": {
                if (target) {
                    taskComponent = <TruthOrDare ref={truthOrDareRef} />;
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
                        <ResultPage />
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
                    <Leaderboard />
                    <KickList ref={kickListRef} />
                </Grid>
            </Grid>
        </>
    );
}
