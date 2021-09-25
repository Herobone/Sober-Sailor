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
import { DocumentSnapshot, updateDoc, FirestoreError, Unsubscribe } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Zoom from "@mui/material/Zoom";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import IconButton from "@mui/material/IconButton";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PollIcon from "@mui/icons-material/Poll";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Player } from "sobersailor-common/lib/models/Player";
import { Game } from "sobersailor-common/lib/models/Game";
import { Task } from "sobersailor-common/lib/models/Task";
import Util from "sobersailor-common/lib/Util";
import { PlayerList } from "sobersailor-common/lib/models/PlayerList";
import { EvaluationScoreboard } from "sobersailor-common/lib/models/EvaluationScoreboard";
import { firebaseApp } from "../../../helper/config";
import { GameManager } from "../../../helper/gameManager";
import { Leaderboard } from "../../Visuals/Leaderboard";
import { WhoWouldRather } from "../../../gamemodes/WhoWouldRather";
import { tasks } from "../../../gamemodes/tasks";
import { TaskUtils } from "../../../helper/TaskUtils";
import { TruthOrDare } from "../../../gamemodes/TruthOrDare";
import { ResultPage } from "../../Visuals/ResultPage";
import { KickList } from "../../Visuals/KickList";
import { TicUtils } from "../../../gamemodes/tictactoe/TicUtils";
import { TicTacToe } from "../../../gamemodes/tictactoe/TicTacToe";
import { useDefaultStyles } from "../../../style/Style";
import { useAnswers, usePenalty, useTarget, useTask, useTaskID, useTaskType } from "../../../state/actions/taskActions";
import { useResult } from "../../../state/actions/resultActions";
import { useIsHost } from "../../../state/actions/gameActions";
import { useEvalState, usePollState } from "../../../state/actions/displayStateActions";
import { EvaluateGame, Serverless } from "../../../helper/Serverless";
import { useScoreboard } from "../../../state/actions/scoreboardAction";
import { useLanguage } from "../../../state/actions/settingActions";
import { WouldYouRather } from "../../../gamemodes/wouldyourather/WouldYouRather";
import { useAlert } from "../../Functional/AlertProvider";
import { Alerts } from "../../../helper/AlertTypes";
import { useDefaultTranslation } from "../../../translations/DefaultTranslationProvider";
import { TranslatedMessage } from "../../../translations/TranslatedMessage";

type TruthOrDareHandle = ElementRef<typeof TruthOrDare>;
type KickListHandle = ElementRef<typeof KickList>;

// Default export needed here for being able to lazy load it
// eslint-disable-next-line import/no-default-export
export default function Mixed(): JSX.Element {
    const truthOrDareRef = useRef<TruthOrDareHandle>(null);

    const kickListRef = useRef<KickListHandle>(null);

    const [lang] = useLanguage();

    const { createAlert } = useAlert();

    const classes = useDefaultStyles();

    const [taskType, setTaskType] = useTaskType();
    const [target, setTarget] = useTarget();
    const setTaskQuestion = useTask()[1];
    const [taskID, setTaskID] = useTaskID();
    const [isHost, setHost] = useIsHost();
    const [pollState, setPollState] = usePollState();
    const [evalState, setEvalState] = useEvalState();
    const [result, setResult] = useResult();
    const setPenalty = usePenalty()[1];
    const [answers, setAnswers] = useAnswers();

    const intl = useDefaultTranslation();

    const setScoreboard = useScoreboard()[1];

    const [timer, setTimer] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [evaluationScoreboard, setEvaluationScoreboard] = useState<EvaluationScoreboard>();

    const submitAndReset = (): void => {
        console.log("Results are", result);
        setResult(null);
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
            GameManager.updatePlayerLookupTable(data);
            console.log("Received data from Firestore!");

            if (taskID !== data.currentTask || taskType !== data.type || target !== data.taskTarget) {
                submitAndReset();
            }

            setTaskID(data.currentTask || undefined);
            setTaskType(data.type || undefined);
            setTarget(data.taskTarget || undefined);
            setPenalty(data.penalty);

            setPollState(data.pollState);

            setEvalState(data.evalState);

            setScoreboard(data.scoreboard);
            setEvaluationScoreboard(data.evaluationScoreboard);

            const auth = getAuth(firebaseApp);
            const user = auth.currentUser;

            setHost(user !== null && data.host === user.uid);
        }
    };

    const onSnapshotError = (error: FirestoreError): void => {
        createAlert(Alerts.ERROR, "Problems updating from Firestore Database! Error code: " + error.code);
    };

    let unsubscribeFirestore: Unsubscribe;

    /// This code will get executed on loading of the page
    useEffect(() => {
        GameManager.joinGame(gameEvent, onSnapshotError)
            .then((unsub) => {
                unsubscribeFirestore = unsub;
                return null;
            })
            .catch(console.error);

        return function cleanup(): void {
            if (unsubscribeFirestore) unsubscribeFirestore();
            console.log("Unsubscribed!");
        };
    }, []);

    useEffect(() => {
        if (!evalState) {
            return;
        }
        const resultData: Player[] = [];
        const plt = GameManager.getPlayerLookupTable();
        if (!plt) {
            throw new Error("PLT was missing. Why is it missing?");
        }

        if (!evaluationScoreboard) {
            return;
        }

        evaluationScoreboard.board.forEach((score: number, uid: string) => {
            const answer = evaluationScoreboard.answers.get(uid) || "none";
            let readableAnswer = intl.formatMessage({ id: "general.answer.forgot" });
            if (taskType === "wouldyourather") {
                if (answers) {
                    answers.forEach((possibleAnswer) => {
                        if (possibleAnswer.id === Number(answer)) {
                            readableAnswer = possibleAnswer.answer;
                        }
                    });
                } else {
                    createAlert(Alerts.ERROR, "Answers were not loaded, therefore could not load the right response");
                }
            } else if (taskType === "tictactoe") {
                switch (answer) {
                    case "winner":
                        readableAnswer = intl.formatMessage({ id: "general.winner" });
                        break;
                    case "loser":
                        readableAnswer = intl.formatMessage({ id: "general.loser" });
                        break;
                    default:
                        readableAnswer = intl.formatMessage({ id: "general.tie" });
                        break;
                }
            } else {
                const temp = plt.playerUidMap.get(answer);
                if (temp) {
                    readableAnswer = temp;
                }
            }
            resultData.push(new Player(uid, plt.playerUidMap.get(uid) || "Error Name", score, readableAnswer));
        });

        setResult(resultData);
    }, [evalState, evaluationScoreboard]);

    const processNewMultiAnswerTask = async (): Promise<void> => {
        if (!taskID || !taskType) return;
        const task = await TaskUtils.getSpecificMultiAnswerTask(taskType, taskID, lang);
        setTaskQuestion(task?.question);
        setAnswers(task?.answers);
    };

    const processNewTask = async (): Promise<void> => {
        if (!taskID || !taskType) return;
        switch (taskType) {
            case "whowouldrather":
            case "truthordare":
                setTaskQuestion(await TaskUtils.getSpecificSingleAnswerTask(taskType, taskID, lang));
                break;
            case "tictactoe":
                break;
            case "wouldyourather":
                await processNewMultiAnswerTask();
                break;
            default:
                createAlert(Alerts.ERROR, "Unknown Task type " + taskType);
                break;
        }
    };

    useEffect(() => {
        processNewTask().catch(console.error);
    }, [taskID, taskType]);

    const setMultiAnswerTask = async (type: Task): Promise<void> => {
        const task = await TaskUtils.getRandomMultiAnswerTask(type.id, lang);
        await updateDoc(GameManager.getGame(), {
            currentTask: task.id,
            type: type.id,
            evalState: false,
            pollState: false,
            taskTarget: null,
            penalty: 0,
        });
    };

    const setTask = async (type: Task, newTarget: PlayerList, newPenalty = 0): Promise<void> => {
        console.log({ task: type, target: newTarget, penalty: newPenalty });
        if (type.id === "tictactoe") {
            await updateDoc(GameManager.getGame(), {
                currentTask: null,
                type: type.id,
                evalState: false,
                pollState: false,
                taskTarget: null,
                penalty: newPenalty,
            });
            if (newTarget && newTarget.length === 2) {
                TicUtils.registerTicTacToe(newTarget).catch(console.error);
            }
        } else {
            const localTarget = newTarget ? newTarget[0] : null;

            const task = await TaskUtils.getRandomTask(type.id, lang);
            setTaskQuestion(task.question);
            await updateDoc(GameManager.getGame(), {
                currentTask: task.id,
                type: type.id,
                evalState: false,
                pollState: false,
                taskTarget: localTarget,
                penalty: newPenalty,
            });
        }
    };

    const nextTaskButtonClick = (): void => {
        if (!isHost) {
            throw new Error("Trying to execute a host method as non Host");
        }
        submitAndReset();
        const testMode = false;
        const development = process.env.NODE_ENV === "development" && testMode;
        const nextTaskType = development ? tasks[0] : Util.selectRandom(tasks);

        if (nextTaskType.multiAnswer) {
            setMultiAnswerTask(nextTaskType).catch(console.error);
            return;
        }

        if (nextTaskType.singleTarget) {
            let targetCount = 1;
            if (nextTaskType.id === "tictactoe") {
                targetCount = 2;
            }
            const nextTarget = GameManager.getRandomPlayer(targetCount);
            setTask(nextTaskType, nextTarget, Util.random(3, 7)).catch(console.error);
        } else {
            setTask(nextTaskType, null).catch(console.error);
        }
    };

    const [taskComponent, setTaskComponent] = useState<ReactElement>(
        <TranslatedMessage id="elements.tasks.notloaded" />,
    );

    useEffect(() => {
        if (!taskType) return;
        switch (taskType) {
            case "whowouldrather": {
                setTaskComponent(<WhoWouldRather />);
                break;
            }
            case "truthordare": {
                if (target) {
                    setTaskComponent(<TruthOrDare ref={truthOrDareRef} />);
                }
                break;
            }
            case "tictactoe": {
                console.log("TicTacToe");
                setTaskComponent(<TicTacToe />);
                break;
            }
            case "wouldyourather": {
                setTaskComponent(<WouldYouRather />);
                break;
            }
            default: {
                console.error("Unexpected task type!");
            }
        }
    }, [taskID, taskType]);

    return (
        <>
            <Grid container spacing={3} className={classes.mainGrid}>
                <Grid item xs={10} md={6}>
                    <div className={classes.mainHeadingName}>
                        <TranslatedMessage id="sobersailor.name" />
                    </div>
                </Grid>
                {timer !== 0 && (
                    <Grid item xs={12}>
                        <span className="countdown-inner">{timer}</span> <TranslatedMessage id="general.seconds" />
                        <LinearProgress variant="determinate" value={(timer / maxTime) * 100} />
                    </Grid>
                )}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                            p: 0.5,
                        }}
                    >
                        {!evalState && taskComponent}
                        {evalState && <ResultPage />}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    {isHost && (
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
                                {!pollState && (
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
                                                const klRef = kickListRef.current;
                                                if (klRef) {
                                                    klRef.show();
                                                }
                                            }}
                                            size="large"
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
