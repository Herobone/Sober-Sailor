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

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import React, { forwardRef, PropsWithChildren, useImperativeHandle, useState } from "react";
import { FormattedMessage } from "react-intl";
import { GameManager } from "../helper/gameManager";
import { Register } from "../helper/models/Register";
import { SingleTargetRequest } from "../helper/models/SingleTarget";
import { Serverless } from "../helper/Serverless";

interface Props {
    question: string;
    target: string;
    penalty: number;
}

type TruthOrDareHandles = {
    reset: () => void;
};

export const TruthOrDare = forwardRef<TruthOrDareHandles, Props>(
    (props: PropsWithChildren<Props>, ref): JSX.Element => {
        const [answer, setAnswer] = useState<boolean | null>(null);

        const submitAnswer = (answerToSet: boolean): void => {
            setAnswer(answerToSet);
            const callData: SingleTargetRequest = { answer: answerToSet, gameID: GameManager.getGameID() };

            Serverless.callFunction("singleTarget")(callData).catch(console.error);
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
            const tar = register.playerUidMap.get(props.target);
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
                {props.question}
                <br />
                <FormattedMessage
                    id="elements.general.penalty"
                    values={{
                        penalty: props.penalty,
                    }}
                />
                <br />
                {props.target === user.uid && answer === null && (
                    <div className="target-area">
                        <button type="submit" onClick={() => submitAnswer(true)}>
                            <FormattedMessage id="elements.truthordare.dare" />
                        </button>
                        <button type="submit" onClick={() => submitAnswer(false)}>
                            <FormattedMessage id="elements.truthordare.drink" />
                        </button>
                    </div>
                )}
                <h2>
                    {answer === false && <FormattedMessage id="elements.truthordare.drink" />}
                    {answer && <FormattedMessage id="elements.truthordare.dare" />}
                </h2>
            </div>
        );
    },
);
