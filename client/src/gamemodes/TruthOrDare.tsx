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

import { ButtonGroup } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { SingleTargetRequest } from "sobersailor-common/lib/SingleTarget";
import { Register } from "sobersailor-common/lib/models/Register";
import { GameManager } from "../helper/gameManager";
import { Serverless } from "../helper/Serverless";
import { useTruthOrDareStyles } from "../style/TruthOrDareStyle";
import { firebaseApp } from "../helper/config";
import { TranslatedMessage } from "../translations/TranslatedMessage";
import { usePenalty, useTarget, useTask } from "../state/actions/taskActions";

const TruthOrDareIntern = (): JSX.Element => {
    const [answer, setAnswer] = useState<boolean | null>(null);
    const classes = useTruthOrDareStyles();

    const [question] = useTask();
    const [target] = useTarget();
    const [penalty] = usePenalty();

    if (!target || !question) {
        return <>Target or Question Missing</>;
    }

    const submitAnswer = (answerToSet: boolean): void => {
        setAnswer(answerToSet);
        const callData: SingleTargetRequest = { answer: answerToSet, gameID: GameManager.getGameID() };

        Serverless.callFunction(Serverless.SINGLE_TARGET)(callData).catch(console.error);
    };

    const pltRaw = localStorage.getItem("playerLookupTable");

    let targetName = "Error";
    if (pltRaw) {
        const register = Register.parse(pltRaw);
        const tar = register.playerUidMap.get(target);
        targetName = tar || "Error";
    }

    const user = getAuth(firebaseApp).currentUser;
    if (!user) {
        return <div className="error">Error user not logged in! This area should be restricted!</div>;
    }
    return (
        <div>
            <h2>{targetName}:</h2>
            <h2>
                <TranslatedMessage id="gamemodes.truthordare" />
            </h2>
            {question}
            <br />
            <TranslatedMessage
                id="elements.general.penalty"
                values={{
                    penalty,
                }}
            />
            <br />
            {target === user.uid && answer === null && (
                <ButtonGroup variant="contained" color="primary" className={classes.buttonGroup}>
                    <Button type="submit" onClick={() => submitAnswer(true)}>
                        <TranslatedMessage id="elements.truthordare.dare" />
                    </Button>
                    <Button type="submit" onClick={() => submitAnswer(false)}>
                        <TranslatedMessage id="elements.truthordare.drink" />
                    </Button>
                </ButtonGroup>
            )}
            {answer !== null && (
                <h2 className={classes.textAtTheBottom}>
                    {!answer && <TranslatedMessage id="elements.truthordare.drink" />}
                    {answer && <TranslatedMessage id="elements.truthordare.dare" />}
                </h2>
            )}
        </div>
    );
};

TruthOrDareIntern.displayName = "Truth or Dare";

export const TruthOrDare = TruthOrDareIntern;
