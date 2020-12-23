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

import React, { ReactElement, RefObject } from 'react';
import '../../../css/App.css';
import { Alert } from '../../../helper/AlertTypes';
import { FormattedMessage } from "react-intl";
import firebase from "firebase";

import GameManager from "../../../helper/gameManager";
import Util from "../../../helper/Util";
import Leaderboard from "../../Visuals/Leaderboard";
import WhoWouldRather from "../../../gamemodes/mixed/WhoWouldRather";

import tasks from "../../../gamemodes/mixed/tasks/tasks.json";
import { getRandomTask } from "../../../helper/taskUtils";
import Cookies from "universal-cookie";
import TruthOrDare from "../../../gamemodes/mixed/TruthOrDare";
import { Player } from '../../../helper/models/Player';

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID: string;
}

interface State {
    nextTask: string | null;
    taskType: string | null;
    isHost: boolean;
    pollState: boolean;
    evalState: boolean;
    result: Player[] | null;
    countdownTimeout: NodeJS.Timeout | null;
}

class Mixed extends React.Component<Props, State> {

    state = {
        nextTask: null,
        taskType: null,
        isHost: false,
        pollState: false,
        evalState: false,
        countdownTimeout: null,
        result: null,
    }

    leaderboardRef: RefObject<Leaderboard>;
    countdownRef: RefObject<HTMLSpanElement>;
    taskRef: RefObject<WhoWouldRather>;

    lang: string;

    constructor(props: Props) {
        super(props);
        this.gameEvent = this.gameEvent.bind(this);
        this.randomButtonClick = this.randomButtonClick.bind(this);
        this.startTimer = this.startTimer.bind(this);

        this.leaderboardRef = React.createRef();
        this.countdownRef = React.createRef();
        this.taskRef = React.createRef();

        const cookies = new Cookies();
        this.lang = cookies.get("locale");
    }

    componentDidMount() {
        GameManager.joinGame(this.props.gameID, this.gameEvent);
        GameManager.amIHost(this.props.gameID).then((host) => this.setState({ isHost: host }));
    }

    gameEvent(doc: firebase.firestore.DocumentSnapshot) {
        let data = doc.data();
        if (data) {
            if (this.state.nextTask !== data.currentTask || this.state.taskType !== data.type) {
                this.setState({
                    nextTask: data.currentTask,
                    taskType: data.type
                });
                GameManager.clearMyAnswer(this.props.gameID);
            }
            if (!this.state.pollState && data.pollState) {
                this.startTimer(20, this.countdownRef);
                this.setState({
                    pollState: true
                });
                if (this.taskRef.current) {
                    this.taskRef.current.lockInput(false);
                }
            }

            if (!this.state.evalState && data.evaluationState) {
                this.setState({
                    evalState: true
                });
                GameManager.evaluateAnswers(this.props.gameID).then((result) => {
                    this.setState({
                        result
                    });
                }).catch(console.error)
            }

            if (!data.evaluationState) {
                this.setState({
                    evalState: false
                });
            }

            if (!data.pollState) {
                if (this.taskRef.current) {
                    this.taskRef.current.lockInput(true);
                }
            }

        }

        if (this.leaderboardRef.current) {
            this.leaderboardRef.current.updateLeaderboard();
        }
    }

    startTimer(duration: number, display: RefObject<HTMLSpanElement>) {
        let timer = duration;
        const timeout = setInterval(() => {
            if (display.current) {
                display.current.innerText = timer.toString();
            }

            if (--timer < 0) {
                const tout = this.state.countdownTimeout;
                if (tout) {
                    clearTimeout(tout);
                }
                this.setState({
                    pollState: false,
                    countdownTimeout: null
                });
                if (this.state.isHost) {
                    GameManager.setPollState(this.props.gameID, false);
                    GameManager.setEvalState(this.props.gameID, true);
                }
            }
        }, 1000);
        this.setState({
            countdownTimeout: timeout
        })
    }

    randomButtonClick() {
        if (!this.state.isHost) {
            return;
        }
        GameManager.clearMyAnswer(this.props.gameID);
        console.log("Random Button activated");
        const taskType = Util.selectRandom(tasks);
        let lang: string;
        if (this.lang in taskType.lang) {
            lang = this.lang
        } else {
            lang = taskType.lang[0];
        }
        getRandomTask(taskType.id, lang).then((task) => {
            this.setState({ nextTask: task });
            GameManager.getGameByID(this.props.gameID).update({
                currentTask: task,
                type: taskType.id,
                evaluationState: false
            }).then(() => console.log("Task updated"))
        });
    }

    render() {
        let currentUser = firebase.auth().currentUser;

        let taskComponent: ReactElement = <FormattedMessage id={'elements.tasks.notloaded'} />

        const task = this.state.nextTask,
            type = this.state.taskType;

        if (task && type) {
            switch (type) {
                case "whowouldrather":
                    taskComponent = <WhoWouldRather question={task} gameID={this.props.gameID} ref={this.taskRef} />
                    break;
                case "truthordare":
                    taskComponent = <TruthOrDare question={task} />
                    break;
            }
        }

        return (
            <div className="w3-center">
                <FormattedMessage id="gamemodes.mixed" />
                <br />
                Game ID: {" "}
                {this.props.gameID}
                <br />
                User ID: {" "}
                {currentUser?.uid}
                <br />
                Next Task: {" "}
                {this.state.nextTask}
                <br />
                Task Type: {" "}
                {this.state.taskType}
                <br />
                <div>
                    <span className="countdown-inner" ref={this.countdownRef}>20</span>
                    {" "}
                    <FormattedMessage id="general.seconds" />
                </div>

                {taskComponent}

                {this.state.isHost && <div className={"host-area"}>
                    <button onClick={this.randomButtonClick}>Random Button</button>
                    <button onClick={() => {
                        GameManager.getAllPlayers(this.props.gameID).then((players) => console.log(players));
                        GameManager.transferHostShip(this.props.gameID).then(() => console.log("New player is now host!"));
                    }}><FormattedMessage id='actions.host.transfer' /></button>
                    <button onClick={() => {
                        GameManager.setPollState(this.props.gameID, true);
                    }}><FormattedMessage id="actions.host.startpoll" /></button>
                </div>}
                <Leaderboard gameID={this.props.gameID} ref={this.leaderboardRef} />
            </div>
        );
    }
}

export default Mixed;
