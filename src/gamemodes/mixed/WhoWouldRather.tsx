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
import GameManager from "../../helper/gameManager";

interface Props {
    question: string;
    gameID: string;
}

interface State {
    players: Map<string, string>;
    inputLocked: boolean;
    answer: string | null;
}

export default class WhoWouldRather extends Component<Props, State> {
    state = {
        players: new Map<string, string>(),
        inputLocked: true,
        answer: null
    }


    constructor(props: Props) {
        super(props);
        this.lockInput = this.lockInput.bind(this);
    }

    componentDidMount() {
        GameManager.getAllPlayers(this.props.gameID).then((players) => this.setState({players}))
    }

    lockInput(lock: boolean) {
        this.setState({
            inputLocked: lock
        });
    }

    render() {
        let values: ReactElement[] = [];
        this.state.players.forEach((value: string, key: string) => {
            values.push(
                <div key={key}>
                    <button className={"wwr-player-select"}
                            onClick={() => {
                                GameManager.myAnswerIs(this.props.gameID, key);
                                this.setState({
                                    answer: value,
                                    inputLocked: true
                                });
                            }}>
                        {value}
                    </button>
                    <br/>
                </div>
            );
        });

        return (
            <div>
                <h2><FormattedMessage id="gamemodes.whowouldrather"/> {this.props.question}</h2>
                <p>
                    <FormattedMessage id='gamemodes.whowouldrather.description'/>
                </p>
                {!this.state.inputLocked && !this.state.answer && values}
                {this.state.answer &&
                <div>
                    <FormattedMessage id="elements.result.youranswer" values={{
                        answer: this.state.answer
                    }} />
                </div>
                }
            </div>
        )
    }
}