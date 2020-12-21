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

import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {storeToLocalFromGit} from "../../helper/taskDownloader"
import Cookies from "universal-cookie";
import Util from "../../helper/Util";

interface Props {

}

interface State {
    ready: boolean;
    question: string | null;
}

export default class WhoWouldRather extends Component<Props, State> {
    state = {
        ready: false,
        question: null
    }

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const cookies = new Cookies();
        const loc = cookies.get("locale");
        storeToLocalFromGit("whowouldrather", loc, () => {
            const questions = localStorage.getItem("whowouldrather_" + loc);
            if (questions) {
                const jQuestions = JSON.parse(questions);
                this.setState({question: jQuestions[Util.random(0, jQuestions.length)], ready: true});
            }
        });
    }

    render() {
        return (
            <div>
                <h2><FormattedMessage id={"gamemodes.whowouldrather"}/></h2>
                {!this.state.ready &&
                <div>
                    Loading questions...
                </div>}

                {!this.state.ready &&
                <div>
                    {this.state.question}
                </div>}
            </div>
        )
    }
}