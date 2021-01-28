/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021.
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

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase/app";
import "firebase/auth";
import { TextField } from "@material-ui/core";
import { Alerts } from "../helper/AlertTypes";
import { useAlert } from "../Components/Functional/AlertProvider";
import { useDIOWStyles } from "../css/DIOWStyles";

interface Props {
    target: string;
    word: string;
}

export function DescribeInOneWord(props: Props): JSX.Element {
    const { createAlert } = useAlert();

    const maxLength = 20;

    const [answer, setAnswer] = useState<string>();

    const classes = useDIOWStyles();

    const setWord = (): void => {
        if (!answer || answer.length < 0) {
            console.log("Word not valid!");
            createAlert(Alerts.WARNING, <FormattedMessage id="elements.diow.word.short" />);
            return;
        }
        if (answer.length > maxLength) {
            console.log("Word not valid!");
            createAlert(Alerts.WARNING, <FormattedMessage id="elements.diow.word.long" values={{ len: maxLength }} />);
            return;
        }
        console.log("Setting Word");
    };

    const user = firebase.auth().currentUser;
    if (!user) {
        throw new Error("No user provided!");
    }
    const amITarget = user.uid === props.target;
    return (
        <div>
            <h2>
                <FormattedMessage id="gamemodes.describeinoneword" />
            </h2>
            {amITarget && <div>Waiting...</div>}
            {!amITarget && (
                <>
                    <div>{props.word}</div>
                    <TextField
                        required
                        label={<FormattedMessage id="elements.diow.word.inputlabel" />}
                        variant="outlined"
                        color="primary"
                        className={classes.wordInput}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setAnswer(event.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === "Enter" || event.key === "Accept") {
                                setWord();
                            }
                        }}
                    />
                    <br />
                    <button type="button" className="w3-button w3-round w3-theme-d5" onClick={setWord}>
                        <FormattedMessage id="general.done" />
                    </button>
                </>
            )}
        </div>
    );
}
