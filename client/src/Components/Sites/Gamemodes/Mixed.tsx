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
import Alerts, { Alert } from '../../../helper/AlertTypes';
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
import ResultPage from '../../Visuals/ResultPage';
import { Game } from '../../../helper/models/Game';
import { Task } from '../../../helper/models/task';
import { Register } from '../../../helper/models/Register';
import KickList from '../../Visuals/KickList';

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
    penalty: number;
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
        penalty: 0,
    }

    leaderboardRef: RefObject<Leaderboard>;
    countdownRef: RefObject<HTMLSpanElement>;
    taskRef: RefObject<WhoWouldRather>;
    resultRef: RefObject<ResultPage>;
    truthOrDareRef: RefObject<TruthOrDare>;
    kickListRef: RefObject<KickList>;

    lang: string;

    constructor(props: Props) {
        super(props);
        this.gameEvent = this.gameEvent.bind(this);
        this.randomButtonClick = this.randomButtonClick.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.submitAndReset = this.submitAndReset.bind(this);
        this.setTask = this.setTask.bind(this);
        this.playerEvent = this.playerEvent.bind(this)
        this.updateLeaderboard = this.updateLeaderboard.bind(this);

        this.leaderboardRef = React.createRef();
        this.countdownRef = React.createRef();
        this.taskRef = React.createRef();
        this.resultRef = React.createRef();
        this.truthOrDareRef = React.createRef();
        this.kickListRef = React.createRef();

        const cookies = new Cookies();
        this.lang = cookies.get("locale");
    }

    componentDidMount() {
        GameManager.joinGame(this.props.gameID, this.gameEvent, this.playerEvent);
        GameManager.amIHost(this.props.gameID).then((host) => {
            this.setState({ isHost: host });
        });
    }

    playerEvent(doc: firebase.firestore.DocumentSnapshot<Register>) {
        const data = doc.data();
        if (data) {
            console.log(data.playerUidMap);
            localStorage.setItem("playerLookupTable", data.stringify());
        }
        this.updateLeaderboard();
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
        const tud = this.truthOrDareRef.current;
        if (tud) {
            tud.reset();
        }
        this.updateLeaderboard();
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
                    target: data.taskTarget,
                    penalty: data.penalty,
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
                if (this.state.taskType === "truthordare") {
                    this.updateLeaderboard();
                } else {
                    GameManager.evaluateAnswers(this.props.gameID).then((result) => {
                        this.setState({
                            result
                        });
                        const res = this.resultRef.current;
                        if (res) {
                            res.updateResults(result);
                        }
                    }).catch(console.error);
                }
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
    }

    updateLeaderboard() {
        const lb = this.leaderboardRef.current;
        if (lb) {
            lb.updateLeaderboard();
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

    setTask(taskType: Task, target: string | null, penalty: number = 0) {
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
                evalState: false,
                pollState: false,
                taskTarget: target,
                penalty: penalty,
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
        let target: string | null = null;
        if (taskType.singleTarget) {
            const pltRaw = localStorage.getItem("playerLookupTable");
            if (pltRaw) {
                const register = Register.parse(pltRaw);

                target = Util.getRandomKey(register.playerUidMap);
                this.setTask(taskType, target, Util.random(3, 6));
            } else {
                this.props.createAlert(Alerts.ERROR, "LocalStorage had no PLT stored!");
            }
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
                        taskComponent = <TruthOrDare ref={this.truthOrDareRef} question={task} target={target} gameID={this.props.gameID} penalty={this.state.penalty} />
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
                    {!this.state.pollState &&
                        <button onClick={this.randomButtonClick}>Random Button</button>
                    }
                    <button onClick={() => {
                        GameManager.getAllPlayers(this.props.gameID).then((players) => console.log(players));
                        GameManager.transferHostShip(this.props.gameID).then(() => console.log("New player is now host!"));
                    }}><FormattedMessage id='actions.host.transfer' /></button>
                    {!this.state.pollState &&
                        <button onClick={() => {
                            GameManager.setPollState(this.props.gameID, true);
                        }}><FormattedMessage id="actions.host.startpoll" /></button>
                    }
                    <br />
                    <button onClick={() => {
                        const klRef = this.kickListRef.current;
                        if (klRef) {
                            klRef.show();
                        }
                    }}>
                        <FormattedMessage id="actions.host.kick" />
                    </button>
                    <KickList createAlert={this.props.createAlert} gameID={this.props.gameID} ref={this.kickListRef}/>
                </div>}
                <Leaderboard gameID={this.props.gameID} ref={this.leaderboardRef} />
            </div>
        );
    }
}

export default Mixed;
