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

import { TableRow, TableCell, TableContainer, TableHead, TableBody, Table, Paper } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { Player } from "sobersailor-common/lib/models/Player";
import { getAuth } from "firebase/auth";
import { TaskType } from "sobersailor-common/lib/gamemodes/tasks";
import { useDefaultStyles } from "../../style/Style";
import { firebaseApp } from "../../helper/config";
import { useEvaluationScoreboard, useResult } from "../../state/actions/resultActions";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { GameManager } from "../../helper/gameManager";
import { Alerts } from "../../helper/AlertTypes";
import { useAnswers, useTaskType } from "../../state/actions/taskActions";
import { useEvalState } from "../../state/actions/displayStateActions";
import { useAlert } from "../Functional/AlertProvider";
import { useDefaultTranslation } from "../../translations/DefaultTranslationProvider";
import { PenaltyScreen } from "./PenaltyScreen";

export function ResultPage(): JSX.Element {
    const classes = useDefaultStyles();

    const { createAlert } = useAlert();

    const intl = useDefaultTranslation();

    const [result] = useResult();
    const [evaluationScoreboard] = useEvaluationScoreboard();
    const [taskType] = useTaskType();
    const [evalState] = useEvalState();
    const [answers] = useAnswers();

    const setResult = useResult()[1];

    const [myPenalty, setMyPenalty] = useState<number>(0);
    const [resultScreen, setResultScreen] = useState<ReactElement[]>();

    const prepareResults = (): void => {
        console.log("Results:", result);
        const auth = getAuth(firebaseApp);
        const uid = auth.currentUser ? auth.currentUser.uid : "nouser";
        const values: ReactElement[] = [];
        let counter = 1;
        setMyPenalty(0);
        if (result !== null) {
            result.forEach((entry: Player) => {
                if (entry.uid == uid) {
                    setMyPenalty(entry.sips);
                }
                values.push(
                    <TableRow key={`rank${counter}`}>
                        <TableCell align="center" className="result-rank">
                            {counter}
                        </TableCell>
                        <TableCell className="result-nickname">{entry.nickname}</TableCell>
                        <TableCell className="result-their-answer">{entry.answer}</TableCell>
                        <TableCell align="center" className="result-sips">
                            {entry.sips}
                        </TableCell>
                    </TableRow>,
                );
                counter++;
            });
        }

        setResultScreen(values);
    };

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
            if (taskType === TaskType.WOULD_YOU_RATHER) {
                if (answers) {
                    answers.forEach((possibleAnswer, id) => {
                        if (id === Number(answer)) {
                            readableAnswer = possibleAnswer;
                        }
                    });
                } else {
                    createAlert(Alerts.ERROR, "Answers were not loaded, therefore could not load the right response");
                }
            } else if (taskType === TaskType.TIC_TAC_TOE) {
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

    useEffect(() => {
        if (!evalState) setResult(null);
    }, [evalState]);

    useEffect(() => prepareResults(), [result]);

    if (!result || result.length <= 0) {
        return <></>;
    }

    return (
        <>
            <PenaltyScreen penalty={myPenalty} />
            <div className={classes.resultTable}>
                <TableContainer component={Paper} elevation={5}>
                    <h2 className={classes.sideHeading}>
                        <TranslatedMessage id="elements.results" />
                    </h2>
                    <Table className="result-table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" className="result-header-rank">
                                    <TranslatedMessage id="elements.general.rank" />
                                </TableCell>
                                <TableCell className="result-header-nickname">
                                    <TranslatedMessage id="general.nickname" />
                                </TableCell>
                                <TableCell className="result-header-their-answer">
                                    <TranslatedMessage id="general.answer" />
                                </TableCell>
                                <TableCell align="center" className="result-header-sips">
                                    <TranslatedMessage id="general.sips" />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{resultScreen}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
