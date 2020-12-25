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
import firebase from "firebase";
import Alerts, {Alert} from "../../helper/AlertTypes";
import {FormattedMessage} from "react-intl";
import GameManager from "../../helper/gameManager";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID?: string;
    gameURL?: string;
}

interface State {
    user: firebase.User | null;
}

export default class GameProvider extends Component<Props, State> {

    nameInputRef!: React.RefObject<HTMLInputElement>;

    state = {
        user: null
    }

    constructor(props: Props) {
        super(props);

        this.createGame = this.createGame.bind(this);

        this.nameInputRef = React.createRef();
        this.setName = this.setName.bind(this);
    }

    componentDidMount() {
        let currentUser = firebase.auth().currentUser;
        if (!currentUser) {
            firebase.auth().signInAnonymously()
                .catch((error) => {
                    this.props.createAlert(Alerts.ERROR, error.message);
                    console.error(error.message);
                });
        } else {
            this.setState({
                user: currentUser
            });
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user: user
                });
            } else {
                console.log("Logging out");
            }
        });
    }

    createGame() {
        if (!this.props.gameURL) {
            this.props.createAlert(Alerts.ERROR, "Fatal error! Unexpected missing Prop!");
            return;
        }
        GameManager.createGame().then((gameID) => {
            window.location.pathname = "/" + this.props.gameURL + "/" + gameID;
        });
    }

    setName() {
        const currentUser = firebase.auth().currentUser,
            input = this.nameInputRef.current;

        if (!input || !currentUser) {
            this.props.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen"/>);
            return;
        }

        if (input.value.length < 3) {
            this.props.createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname"/>);
            return;
        }

        currentUser.updateProfile({displayName: input.value});
        this.forceUpdate();
    }

    render() {
        const gameID = this.props.gameID;
        const user = this.state.user;
        if (!gameID) {
            return (
                <div className="w3-center">
                    <p className="sailor-creategame-button">
                        <button onClick={this.createGame} className="w3-btn w3-round w3-orange w3-xlarge">
                            <FormattedMessage id="actions.game.create"/>
                        </button>
                    </p>
                </div>
            );
        }

        const currentUser = firebase.auth().currentUser;

        if (!user) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        if (currentUser) {
            if (currentUser.displayName && currentUser.displayName !== "") {
                return (
                    <div>
                        {this.props.children}
                        <button onClick={() => GameManager.leaveGame(gameID)}><FormattedMessage id={'actions.leave'}/></button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1>
                            <FormattedMessage id="account.descriptors.finishsignup"/>
                        </h1>
                        <p>
                            <label><b><FormattedMessage id="account.descriptors.yourname"/></b></label>
                            <br/>
                            <input
                                ref={this.nameInputRef}
                                className="w3-input w3-border w3-round"
                                name="name"
                                type="text"
                                style={{width: "40%"}}
                                placeholder="Name"
                            />
                        </p>
                        <br/>
                        <button className="w3-button w3-round w3-theme-d5" onClick={this.setName}>
                            <FormattedMessage id="general.done"/>
                        </button>
                    </div>
                );
            }
        }


    }
}
