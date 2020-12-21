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

import {getGameByID, joinGame, amIHost, getAllPlayers, transferHostShip} from "../../../helper/gameManager";
import Util from "../../../helper/Util";
import Leaderboard from "../../Visuals/Leaderboard";
import WhoWouldRather from "../../../gamemodes/mixed/WhoWouldRather";

import tasks from "../../../gamemodes/mixed/tasks/tasks.json";
import {getRandomTask} from "../../../helper/taskUtils";
import Cookies from "universal-cookie";
import TruthOrDare from "../../../gamemodes/mixed/TruthOrDare";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID: string;
}

interface State {
    nextTask: string | null;
    taskType: string | null;
    isHost: boolean;
}

class Mixed extends React.Component<Props, State> {

    state = {
        nextTask: null,
        taskType: null,
        isHost: false
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
        amIHost(this.props.gameID).then((host) => this.setState({isHost: host}));
    }

    gameEvent(doc: firebase.firestore.DocumentSnapshot) {
        let data = doc.data();
        if (data) {
            this.setState({
                nextTask: data.currentTask,
                taskType: data.type
            });
        }

        if (this.leaderboardRef.current) {
            this.leaderboardRef.current.updateLeaderboard();
        }
    }

    randomButtonClick() {
        if (!this.state.isHost) {
            return;
        }
        console.log("Random Button activated");
        const taskType = Util.selectRandom(tasks);
        let lang: string;
        if (this.lang in taskType.lang) {
            lang = this.lang
        } else {
            lang = taskType.lang[0];
        }
        const nextTask = getRandomTask(taskType.id, lang, task => {
            this.setState({nextTask: task});
            getGameByID(this.props.gameID).update({
                currentTask: task,
                type: taskType.id
            }).then(r => console.log("Task updated"))
        });
    }

    render() {
        let currentUser = firebase.auth().currentUser;

        let taskComponent: ReactElement = <FormattedMessage id={'elements.tasks.notloaded'}/>

        const task = this.state.nextTask,
            type = this.state.taskType;

        if (task && type) {
            switch (type) {
                case "whowouldrather":
                    taskComponent = <WhoWouldRather question={task} gameID={this.props.gameID}/>
                    break;
                case "truthordare":
                    taskComponent = <TruthOrDare question={task}/>
                    break;
            }
        }

        return (
            <div className="w3-center">
                <FormattedMessage id="gamemodes.mixed"/>
                <br/>
                Game ID: {" "}
                {this.props.gameID}
                <br/>
                User ID: {" "}
                {currentUser?.uid}
                <br/>
                Next Task: {" "}
                {this.state.nextTask}
                <br/>
                Task Type: {" "}
                {this.state.taskType}
                <br/>

                {taskComponent}

                {this.state.isHost && <div className={"host-area"}>
                    <button onClick={this.randomButtonClick}>Random Button</button>
                    <button onClick={() => {
                        getAllPlayers(this.props.gameID).then((players) => console.log(players));
                        transferHostShip(this.props.gameID).then(() => console.log("New player is now host!"));
                    }}>Transfer Host</button>
                </div>}
                <Leaderboard gameID={this.props.gameID} ref={this.leaderboardRef}/>
            </div>
        );
    }
}

export default Mixed;
