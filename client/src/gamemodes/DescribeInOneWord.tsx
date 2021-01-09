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

import React, { Component, ReactElement, RefObject } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase";
import DIOWStyle from "../css/App.module.scss";
import { Alert, Alerts } from "../helper/AlertTypes";
import { AlertContext } from "../Components/Functional/AlertProvider";

interface Props {
    target: string;
}
interface State {
    answer?: string;
}

export class DescribeInOneWord extends Component<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    wordInputRef: RefObject<HTMLInputElement>;

    maxLength = 20;

    constructor(props: Props) {
        super(props);
        this.state = {};

        this.wordInputRef = React.createRef();
    }

    setWord = (): void => {
        const refCurrent = this.wordInputRef.current;
        if (!refCurrent) {
            return;
        }
        const { value } = refCurrent;
        if (!value || value.length < 0) {
            console.log("Word not valid!");
            this.context.createAlert(Alerts.WARNING, <FormattedMessage id="elements.diow.word.short" />);
            return;
        }
        if (value.length > this.maxLength) {
            console.log("Word not valid!");
            this.context.createAlert(
                Alerts.WARNING,
                <FormattedMessage id="elements.diow.word.long" values={{ len: this.maxLength }} />,
            );
            return;
        }
        console.log("Setting Word");
    };

    render(): JSX.Element {
        const user = firebase.auth().currentUser;
        if (!user) {
            throw new Error("No user provided!");
        }
        const amITarget = user.uid === this.props.target;
        return (
            <div>
                <h2>
                    <FormattedMessage id="gamemodes.describeinoneword" />
                </h2>
                {amITarget && <div>Waiting...</div>}
                {!amITarget && (
                    <div>
                        <p>
                            <label htmlFor="word-input">
                                <b>Word:</b>
                            </label>
                            <br />
                            <input
                                ref={this.wordInputRef}
                                id="word-input"
                                className={DIOWStyle.wordInput}
                                name="name"
                                type="text"
                                placeholder="Word"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === "Accept") {
                                        this.setWord();
                                    }
                                }}
                            />
                        </p>
                        <br />
                        <button type="button" className="w3-button w3-round w3-theme-d5" onClick={this.setWord}>
                            <FormattedMessage id="general.done" />
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
