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

import React, { ElementRef, ReactElement, useEffect, useRef, useState } from "react";
import { DocumentSnapshot, FirestoreError, Unsubscribe } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Game } from "sobersailor-common/lib/models/Game";
import { getDatabase, onValue, ref, Unsubscribe as UnsubscribeDB } from "firebase/database";
import { DatabaseGame } from "sobersailor-common/lib/models/DatabaseStructure";
import Util from "sobersailor-common/lib/Util";
import { TaskType } from "sobersailor-common/lib/gamemodes/tasks";
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
import { useEvaluationScoreboard, useResult } from "../../../state/actions/resultActions";
import { useIsHost, usePlayersOnline, usePlayersReady } from "../../../state/actions/gameActions";
import { useBackgroundState, useEvalState, usePollState } from "../../../state/actions/displayStateActions";
import { useScoreboard } from "../../../state/actions/scoreboardAction";
import { useLanguage } from "../../../state/actions/settingActions";
import { WouldYouRather } from "../../../gamemodes/wouldyourather/WouldYouRather";
import { useAlert } from "../../Functional/AlertProvider";
import { Alerts } from "../../../helper/AlertTypes";
import { TranslatedMessage } from "../../../translations/TranslatedMessage";
import { CatPontent } from "../../Visuals/CatPontent";
import { Timer } from "../../Visuals/Timer";
import { AdminPanel } from "../../Visuals/AdminPanel";

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
    const setPollState = usePollState()[1];
    const [evalState, setEvalState] = useEvalState();
    const setResult = useResult()[1];
    const setAnswers = useAnswers()[1];

    const setBackgroundState = useBackgroundState()[1];

    const setCombined = useAll();

    const setScoreboard = useScoreboard()[1];

    const notLoaded = (
        <>
            <TranslatedMessage id="elements.tasks.notloaded" />
            <br />
            <CatPontent />
        </>
    );
    const setEvaluationScoreboard = useEvaluationScoreboard()[1];
    const [taskComponent, setTaskComponent] = useState<ReactElement>(notLoaded);
    const setPlayersOnline = usePlayersOnline()[1];
    const setPlayersReady = usePlayersReady()[1];

    const db = getDatabase();

    const reset = (): void => {
        setPlayersReady([]);
        setResult(null);
    };

    const gameEvent = (doc: DocumentSnapshot<Game>): void => {
        const data = doc.data();
        if (data) {
            GameManager.updatePlayerLookupTable(data);
            console.log("Received data from Firestore!");

            if (taskID !== data.currentTask || taskType !== data.type || target !== data.taskTarget) {
                reset();
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

    const setupGameDBListener = (): UnsubscribeDB => {
        const gameDataDBRef = ref(db, GameManager.getGameID());

        return onValue(
            gameDataDBRef,
            (snap) => {
                const tempAnswers: string[] = [];
                const data: DatabaseGame = snap.val();
                const users = Util.objToMap(data.users);
                const online: string[] = [];
                for (const [uid, user] of users) {
                    if (user.onlineState) {
                        online.push(uid);
                    }
                    if (user.answer) {
                        tempAnswers.push(uid);
                    }
                }
                setPlayersReady(tempAnswers);
                setPlayersOnline(online);
            },
            (error) => {
                console.error("Request cancelled! Reason: " + error);
            },
        );
    };

    /// This code will get executed on loading of the page
    useEffect(() => {
        let unsubscribeFirestore: Unsubscribe;
        const unsubscribeDatabase: UnsubscribeDB = setupGameDBListener();
        GameManager.joinGame(gameEvent, onSnapshotError)
            .then((unsub) => {
                unsubscribeFirestore = unsub;
                return null;
            })
            .catch(console.error);
        setBackgroundState(true);

        return function cleanup(): void {
            if (unsubscribeFirestore) unsubscribeFirestore();
            unsubscribeDatabase();
            console.log("Unsubscribed!");
            setBackgroundState(false);
        };
    }, []);

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
            case TaskType.WHO_WOULD_RATHER:
                setTaskComponent(<WhoWouldRather />);
                break;
            case TaskType.TRUTH_OR_DARE:
                setTaskComponent(<TruthOrDare />);
                break;
            default:
                unknownTypeAlert();
                break;
        }
    };

    const processNewTask = async (): Promise<void> => {
        switch (taskType) {
            case TaskType.WHO_WOULD_RATHER:
            case TaskType.TRUTH_OR_DARE:
                await processNewSingleAnswerTask();
                break;
            case TaskType.TIC_TAC_TOE:
                setTaskComponent(<TicTacToe />);
                break;
            case TaskType.WOULD_YOU_RATHER:
                await processNewMultiAnswerTask();
                break;
            case undefined:
                setTaskComponent(notLoaded);
                break;
            default:
                unknownTypeAlert();
                break;
        }
    };

    useEffect(() => {
        processNewTask().catch(console.error);
    }, [taskID, taskType, target]);

    return (
        <Grid container spacing={3} sx={{ pl: -3 }} className={classes.mainGrid}>
            <Grid item xs={10} md={6}>
                <div className={classes.mainHeadingName}>
                    <TranslatedMessage id="sobersailor.name" />
                </div>
            </Grid>
            <Grid item xs={12}>
                <Timer />
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 0.5,
                    }}
                >
                    {(!evalState || taskType === TaskType.TIC_TAC_TOE) && taskComponent}
                    {evalState && <ResultPage />}
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                {isHost && <AdminPanel />}
                <Leaderboard />
                <KickList ref={kickListRef} />
            </Grid>
        </Grid>
    );
}
