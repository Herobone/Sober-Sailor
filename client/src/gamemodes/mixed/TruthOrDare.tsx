/*****************************
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

import firebase from 'firebase';
import { Component } from 'react';
import { FormattedMessage } from "react-intl";
import { Register } from "../../helper/models/Register";
import { SingleTargetRequest, SingleTargetResult } from '../../helper/models/SingleTarget';

interface Props {
    question: string;
    target: string;
    gameID: string;
    penalty: number;
}

interface State {
    answer: boolean | null;
}

export default class TruthOrDare extends Component<Props, State> {
    state = {
        answer: null,
    }

    constructor(props: Props) {
        super(props);
        this.setAnswer = this.setAnswer.bind(this);
        this.reset = this.reset.bind(this);
    }

    setAnswer(answer: boolean) {
        this.setState({
            answer
        });
        const callData: SingleTargetRequest = { answer: answer, gameID: this.props.gameID};
        const singleTarget = firebase.functions().httpsCallable("singleTarget")
        singleTarget(callData).then((d) => {
            const data: SingleTargetResult = d.data;
            console.log(data);
        })
    }

    reset() {
        this.setState({
            answer: null
        })
    }

    render() {
        const pltRaw = localStorage.getItem("playerLookupTable");

        let targetName: string = "Error";
        if (pltRaw) {
            const register = Register.parse(pltRaw);
            const tar = register.playerUidMap.get(this.props.target);
            targetName = tar ? tar : "Error";
        }

        const user = firebase.auth().currentUser;
        if (!user) {
            return (<div className={"error"}>
                Error user not logged in! This area should be restricted!
            </div>);
        }
        return (
            <div>
                <h2>{targetName}:</h2>
                <h2><FormattedMessage id={"gamemodes.truthordare"} /></h2>
                {this.props.question}
                <br />
                <FormattedMessage id="elements.general.penalty" values={{
                    penalty: this.props.penalty
                }} />
                <br />
                {this.props.target === user.uid &&
                    this.state.answer === null &&
                    <div className={"target-area"}>
                        <button onClick={() => this.setAnswer(true)}><FormattedMessage id={"elements.truthordare.dare"} /></button>
                        <button onClick={() => this.setAnswer(false)}><FormattedMessage id={"elements.truthordare.drink"} /></button>
                    </div>
                }
                <h2>
                    {this.state.answer === false &&
                        <FormattedMessage id={"elements.truthordare.drink"} />
                    }
                    {this.state.answer &&
                        <FormattedMessage id={"elements.truthordare.dare"} />
                    }
                </h2>
            </div>
        )
    }
}