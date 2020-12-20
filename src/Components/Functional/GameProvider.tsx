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

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
    user: firebase.User | null;
}

export default class GameProvider extends Component<Props, State> {
    state = {
        user: null
    }

    constructor(props: Props) {
        super(props);
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

    render() {
        return (
            <div>
                {this.state.user && this.props.children}
                {!this.state.user &&
                <div>
                    Loading...
                </div>}
            </div>
        )
    }
}
