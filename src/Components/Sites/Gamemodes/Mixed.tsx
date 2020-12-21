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

import React, {ReactElement, RefObject} from 'react';
import '../../../css/App.css';
import {Alert} from '../../../helper/AlertTypes';
import {FormattedMessage} from "react-intl";
import firebase from "firebase";

import {getGameByID, joinGame} from "../../../helper/gameManager";
import Util from "../../../helper/Util";
import Leaderboard from "../../Visuals/Leaderboard";
import WhoWouldRather from "../../../gamemodes/mixed/WhoWouldRather";

import tasks from "../../../gamemodes/mixed/tasks/tasks.json";
import {getRandomTask} from "../../../helper/taskUtils";
import Cookies from "universal-cookie";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID: string;
}

interface State {
    nextTask: string | null
}

class Mixed extends React.Component<Props, State> {

    state = {
        nextTask: null
    }

    leaderboardRef: RefObject<Leaderboard>;
    lang: string;

    constructor(props: Props) {
        super(props);
        this.gameEvent = this.gameEvent.bind(this);
        this.randomButtonClick = this.randomButtonClick.bind(this);
        this.leaderboardRef = React.createRef();

        const cookies = new Cookies();
        this.lang = cookies.get("locale");
    }

    componentDidMount() {
        joinGame(this.props.gameID, this.gameEvent);
    }

    gameEvent(doc: firebase.firestore.DocumentSnapshot) {
        let data = doc.data();
        if (data) {
            this.setState({
                nextTask: data.currentTask
            });
        }

        if (this.leaderboardRef.current) {
            this.leaderboardRef.current.updateLeaderboard();
        }
    }

    randomButtonClick() {
        console.log("Random Button activated");
        const taskType = Util.selectRandom(tasks);
        const nextTask = getRandomTask(taskType.id, this.lang, task => {
            this.setState({nextTask: task});
            getGameByID(this.props.gameID).update({
                currentTask: task,
                type: taskType.id
            })
        });
    }

    render() {
        let currentUser = firebase.auth().currentUser;

        return (
            <div className="w3-center">
                <FormattedMessage id="gamemodes.mixed"/>
                <br/>
                Game ID:
                {this.props.gameID}
                <br/>
                User ID:
                {currentUser?.uid}
                <br/>
                Next Task:
                {this.state.nextTask}
                <br/>
                <WhoWouldRather />
                <button onClick={this.randomButtonClick}>Random Button</button>
                <Leaderboard gameID={this.props.gameID} ref={this.leaderboardRef}/>
            </div>
        );
    }
}

export default Mixed;
