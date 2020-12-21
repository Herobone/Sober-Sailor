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

import React, {Component, ReactElement} from 'react';
import {FormattedMessage} from "react-intl";
import {getRandomTask} from "../../helper/taskUtils";
import Cookies from "universal-cookie";
import {getAllPlayers, myAnswerIs} from "../../helper/gameManager";

interface Props {
    question: string;
    gameID: string;
}

interface State {
    players: Map<string, string>;
}

export default class WhoWouldRather extends Component<Props, State> {
    state = {
        players: new Map<string, string>()
    }


    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        getAllPlayers(this.props.gameID).then((players) => this.setState({players}))
    }

    render() {
        let vals: ReactElement[] = [];
        let counter = 1;
        this.state.players.forEach((value: string, key: string) => {
            vals.push(
                <button key={key} className={"wwr-player-select"} onClick={() => myAnswerIs(this.props.gameID, key)}>
                    {value}
                </button>
            );
            counter++;
        });

        return (
            <div>
                <h2><FormattedMessage id="gamemodes.whowouldrather"/>...</h2>
                ...{this.props.question}
                {vals}
            </div>
        )
    }
}