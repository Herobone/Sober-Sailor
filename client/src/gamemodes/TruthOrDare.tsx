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

import { ButtonGroup } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FormattedMessage } from "react-intl";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { GameManager } from "../helper/gameManager";
import { Register } from "../helper/models/Register";
import { SingleTargetRequest } from "../helper/models/SingleTarget";
import { Serverless } from "../helper/Serverless";
import { useTruthOrDareStyles } from "../css/TruthOrDareStyle";
import { RootState } from "../state/store";
import { TaskState } from "../state/reducers/taskReducer";

type TruthOrDareHandles = {
    reset: () => void;
};

const TruthOrDareIntern = forwardRef<TruthOrDareHandles>((props: unknown, ref): JSX.Element => {
    const [answer, setAnswer] = useState<boolean | null>(null);
    const classes = useTruthOrDareStyles();

    const question = useSelector<RootState, TaskState["task"]>((state) => state.task.task);
    const target = useSelector<RootState, TaskState["target"]>((state) => state.task.target);
    const penalty = useSelector<RootState, TaskState["penalty"]>((state) => state.task.penalty);

    if (!target || !question) {
        return <></>;
    }

    const submitAnswer = (answerToSet: boolean): void => {
        setAnswer(answerToSet);
        const callData: SingleTargetRequest = { answer: answerToSet, gameID: GameManager.getGameID() };

        Serverless.callFunction(Serverless.SINGLE_TARGET)(callData).catch(console.error);
    };

    const reset = (): void => {
        setAnswer(null);
    };

    useImperativeHandle(ref, () => ({
        reset,
    }));

    const pltRaw = localStorage.getItem("playerLookupTable");

    let targetName = "Error";
    if (pltRaw) {
        const register = Register.parse(pltRaw);
        const tar = register.playerUidMap.get(target);
        targetName = tar || "Error";
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        return <div className="error">Error user not logged in! This area should be restricted!</div>;
    }
    return (
        <div>
            <h2>{targetName}:</h2>
            <h2>
                <FormattedMessage id="gamemodes.truthordare" />
            </h2>
            {question}
            <br />
            <FormattedMessage
                id="elements.general.penalty"
                values={{
                    penalty,
                }}
            />
            <br />
            {target === user.uid && answer === null && (
                <ButtonGroup variant="contained" color="primary" className={classes.buttonGroup}>
                    <Button type="submit" onClick={() => submitAnswer(true)}>
                        <FormattedMessage id="elements.truthordare.dare" />
                    </Button>
                    <Button type="submit" onClick={() => submitAnswer(false)}>
                        <FormattedMessage id="elements.truthordare.drink" />
                    </Button>
                </ButtonGroup>
            )}
            {answer !== null && (
                <h2 className={classes.textAtTheBottom}>
                    {!answer && <FormattedMessage id="elements.truthordare.drink" />}
                    {answer && <FormattedMessage id="elements.truthordare.dare" />}
                </h2>
            )}
        </div>
    );
});

TruthOrDareIntern.displayName = "Truth or Dare";

export const TruthOrDare = TruthOrDareIntern;
