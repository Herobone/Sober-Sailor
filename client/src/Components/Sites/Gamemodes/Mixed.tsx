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
import { Player, playerConverter } from '../../../helper/models/Player';
import ResultPage from '../../Visuals/ResultPage';
import { Game } from '../../../helper/models/Game';
import { Task } from '../../../helper/models/task';

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID: string;
}

interface State {
    nextTask: string | null;
    taskType: string | null;
    target: string | null;
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
        target: null,
        isHost: false,
        pollState: false,
        evalState: false,
        countdownTimeout: null,
        result: null,
    }

    leaderboardRef: RefObject<Leaderboard>;
    countdownRef: RefObject<HTMLSpanElement>;
    taskRef: RefObject<WhoWouldRather>;
    resultRef: RefObject<ResultPage>;

    lang: string;

    constructor(props: Props) {
        super(props);
        this.gameEvent = this.gameEvent.bind(this);
        this.randomButtonClick = this.randomButtonClick.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.submitAndReset = this.submitAndReset.bind(this);
        this.setTask = this.setTask.bind(this);
        this.hostPlayerHandel = this.hostPlayerHandel.bind(this)

        this.leaderboardRef = React.createRef();
        this.countdownRef = React.createRef();
        this.taskRef = React.createRef();
        this.resultRef = React.createRef();

        const cookies = new Cookies();
        this.lang = cookies.get("locale");
    }

    componentDidMount() {
        GameManager.joinGame(this.props.gameID, this.gameEvent);
        GameManager.amIHost(this.props.gameID).then((host) => {
            this.setState({ isHost: host });
            if (host) {
                GameManager.getGameByID(this.props.gameID).collection("players").withConverter(playerConverter).onSnapshot(this.hostPlayerHandel)
            }
        });
    }

    hostPlayerHandel(col: firebase.firestore.QuerySnapshot<Player>) {
        col.forEach((result) => {
            const data = result.data();
            console.log("Change on:", data);
        })
    }

    submitAndReset() {
        const resultsWere = this.state.result;
        if (resultsWere) {
            GameManager.afterEval(this.props.gameID, resultsWere)
                .then(() => this.setState({
                    result: null
                }));
        }
        const res = this.resultRef.current;
        if (res) {
            res.updateResults([]);
        }
    }

    gameEvent(doc: firebase.firestore.DocumentSnapshot<Game>) {
        const data = doc.data();
        if (data) {
            if (this.state.nextTask !== data.currentTask ||
                this.state.taskType !== data.type ||
                this.state.target !== data.taskTarget) {
                this.submitAndReset();
                this.setState({
                    nextTask: data.currentTask,
                    taskType: data.type,
                    target: data.taskTarget
                });
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

            if (!this.state.evalState && data.evalState) {
                console.log("Eval state changed to true!");
                this.setState({
                    evalState: true
                });
                GameManager.evaluateAnswers(this.props.gameID).then((result) => {
                    this.setState({
                        result
                    });
                    const res = this.resultRef.current;
                    if (res) {
                        res.updateResults(result);
                    }
                }).catch(console.error)
            }

            if (!data.evalState) {
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

    setTask(taskType: Task, target: Player | null) {
        let lang: string;
        if (this.lang in taskType.lang) {
            lang = this.lang
        } else {
            lang = taskType.lang[0];
        }
        let tar = target ? target.uid : null;
        getRandomTask(taskType.id, lang).then((task) => {
            this.setState({ nextTask: task });
            GameManager.getGameByID(this.props.gameID).update({
                currentTask: task,
                type: taskType.id,
                evalState: false,
                pollState: false,
                taskTarget: tar
            }).then(() => console.log("Task updated"));
        });
    }

    randomButtonClick() {
        if (!this.state.isHost) {
            return;
        }
        console.log("Random Button activated");
        this.submitAndReset();
        const taskType: Task = Util.selectRandom(tasks);
        let target: Player | null = null;
        if (taskType.singleTarget) {
            GameManager.getAllPlayers(this.props.gameID).then((players: Player[]) => {
                target = Util.selectRandom(players);
                this.setTask(taskType, target);
            });
        } else {
            this.setTask(taskType, null);
        }
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
                    const target = this.state.target;
                    if (target) {

                        taskComponent = <TruthOrDare question={task} target={target} />
                    }
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

                <ResultPage ref={this.resultRef} />

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
