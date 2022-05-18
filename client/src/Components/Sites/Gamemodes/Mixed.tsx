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
import { DocumentSnapshot, FirestoreError, Unsubscribe } from "firebase/firestore";
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
import { EvaluationScoreboard } from "sobersailor-common/lib/models/EvaluationScoreboard";
import { firebaseApp } from "../../../helper/config";
import { GameManager } from "../../../helper/gameManager";
import { Leaderboard } from "../../Visuals/Leaderboard";
import { WhoWouldRather } from "../../../gamemodes/WhoWouldRather";
import { TaskUtils } from "../../../helper/TaskUtils";
import { TruthOrDare } from "../../../gamemodes/TruthOrDare";
import { ResultPage } from "../../Visuals/ResultPage";
import { KickList } from "../../Visuals/KickList";
import { TicTacToe } from "../../../gamemodes/tictactoe/TicTacToe";
import { useDefaultStyles } from "../../../style/Style";
import { useAll, useAnswers, useTarget, useTask, useTaskID, useTaskType } from "../../../state/actions/taskActions";
import { useResult } from "../../../state/actions/resultActions";
import { useIsHost } from "../../../state/actions/gameActions";
import { useBackgroundState, useEvalState, usePollState } from "../../../state/actions/displayStateActions";
import { EvaluateGame, Serverless } from "../../../helper/Serverless";
import { useScoreboard } from "../../../state/actions/scoreboardAction";
import { useLanguage } from "../../../state/actions/settingActions";
import { WouldYouRather } from "../../../gamemodes/wouldyourather/WouldYouRather";
import { useAlert } from "../../Functional/AlertProvider";
import { Alerts } from "../../../helper/AlertTypes";
import { useDefaultTranslation } from "../../../translations/DefaultTranslationProvider";
import { TranslatedMessage } from "../../../translations/TranslatedMessage";
import { CatPontent } from "../../Visuals/CatPontent";

type KickListHandle = ElementRef<typeof KickList>;

// Default export needed here for being able to lazy load it
// eslint-disable-next-line import/no-default-export
export default function Mixed(): JSX.Element {
    const kickListRef = useRef<KickListHandle>(null);

    const [lang] = useLanguage();

    const { createAlert } = useAlert();

    const classes = useDefaultStyles();

    const [taskType] = useTaskType();
    const [target] = useTarget();
    const setTaskQuestion = useTask()[1];
    const [taskID] = useTaskID();
    const [isHost, setHost] = useIsHost();
    const [pollState, setPollState] = usePollState();
    const [evalState, setEvalState] = useEvalState();
    const [result, setResult] = useResult();
    const [answers, setAnswers] = useAnswers();

    const setBackgroundState = useBackgroundState()[1];

    const setCombined = useAll();

    const intl = useDefaultTranslation();

    const setScoreboard = useScoreboard()[1];

    const notLoaded = (
        <>
            <TranslatedMessage id="elements.tasks.notloaded" />
            <br />
            <CatPontent />
        </>
    );

    const [timer, setTimer] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [evaluationScoreboard, setEvaluationScoreboard] = useState<EvaluationScoreboard>();
    const [taskComponent, setTaskComponent] = useState<ReactElement>(notLoaded);
    const [votable, setVotable] = useState(false);

    const submitAndReset = (): void => {
        console.log("Results are", result);
        setResult(null);
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
        if (!evalState) setResult(null);
    }, [evalState]);

    const gameEvent = (doc: DocumentSnapshot<Game>): void => {
        const data = doc.data();
        if (data) {
            GameManager.updatePlayerLookupTable(data);
            console.log("Received data from Firestore!");

            if (taskID !== data.currentTask || taskType !== data.type || target !== data.taskTarget) {
                submitAndReset();
            }

            setCombined(
                data.type || undefined,
                data.penalty,
                data.currentTask || undefined,
                data.taskTarget || undefined,
            );

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

    /// This code will get executed on loading of the page
    useEffect(() => {
        let unsubscribeFirestore: Unsubscribe;
        GameManager.joinGame(gameEvent, onSnapshotError)
            .then((unsub) => {
                unsubscribeFirestore = unsub;
                return null;
            })
            .catch(console.error);
        setBackgroundState(true);

        return function cleanup(): void {
            if (unsubscribeFirestore) unsubscribeFirestore();
            console.log("Unsubscribed!");
            setBackgroundState(false);
        };
    }, []);

    useEffect(() => {
        if (!evalState) return;

        const resultData: Player[] = [];
        const plt = GameManager.getPlayerLookupTable();
        if (!plt) {
            throw new Error("PLT was missing. Why is it missing?");
        }

        if (!evaluationScoreboard || evaluationScoreboard.board.size <= 0) return;

        evaluationScoreboard.board.forEach((score: number, uid: string) => {
            const answer = evaluationScoreboard.answers.get(uid) || "none";
            let readableAnswer = intl.formatMessage({ id: "general.answer.forgot" });
            if (taskType === "wouldyourather") {
                if (answers) {
                    answers.forEach((possibleAnswer, id) => {
                        if (id === Number(answer)) {
                            readableAnswer = possibleAnswer;
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
    }, [evalState, evaluationScoreboard, taskType]);

    const unknownTypeAlert = (): void => createAlert(Alerts.ERROR, "Unknown Task type " + taskType);

    const processNewMultiAnswerTask = async (): Promise<void> => {
        if (!taskID || !taskType) return;
        const task = await TaskUtils.getSpecificMultiAnswerTask(taskType, taskID, lang);
        setTaskQuestion(task?.question);
        setAnswers(task?.answers);
        setTaskComponent(<WouldYouRather />);
    };

    const processNewSingleAnswerTask = async (): Promise<void> => {
        if (taskID && taskType) {
            const question = await TaskUtils.getSpecificSingleAnswerTask(taskType, taskID, lang);
            setTaskQuestion(question);
        }

        switch (taskType) {
            case "whowouldrather":
                setTaskComponent(<WhoWouldRather />);
                setVotable(true);
                break;
            case "truthordare":
                setTaskComponent(<TruthOrDare />);
                setVotable(false);
                break;
            default:
                unknownTypeAlert();
                break;
        }
    };

    const processNewTask = async (): Promise<void> => {
        switch (taskType) {
            case "whowouldrather":
            case "truthordare":
                await processNewSingleAnswerTask();
                break;
            case "tictactoe":
                console.log("TicTacToe");
                setTaskComponent(<TicTacToe />);
                setVotable(false);
                break;
            case "wouldyourather":
                await processNewMultiAnswerTask();
                setVotable(true);
                break;
            case undefined:
                setTaskComponent(notLoaded);
                setVotable(false);
                break;
            default:
                unknownTypeAlert();
                setVotable(false);
                break;
        }
    };

    useEffect(() => {
        processNewTask().catch(console.error);
    }, [taskID, taskType, target]);

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

    return (
        <>
            <Grid container spacing={3} sx={{ pl: -3 }} className={classes.mainGrid}>
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
