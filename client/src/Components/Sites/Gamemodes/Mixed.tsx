/** ***************************
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

import React, { ReactElement, RefObject } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/messaging";
import Cookies from "universal-cookie";

import { Button } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import { GameManager } from "../../../helper/gameManager";
import { Util } from "../../../helper/Util";
import { Leaderboard } from "../../Visuals/Leaderboard";
import { WhoWouldRather } from "../../../gamemodes/WhoWouldRather";

import tasks from "../../../gamemodes/tasks.json";
import { getRandomTask } from "../../../helper/TaskUtils";
import { TruthOrDare } from "../../../gamemodes/TruthOrDare";
import { Player } from "../../../helper/models/Player";
import { ResultPage } from "../../Visuals/ResultPage";
import { Game } from "../../../helper/models/Game";
import { Task } from "../../../helper/models/task";
import { Register } from "../../../helper/models/Register";
import { KickList } from "../../Visuals/KickList";
import { TicUtils } from "../../../gamemodes/tictactoe/TicUtils";
import { PlayerList } from "../../../helper/models/CustomTypes";
import { TicTacToe } from "../../../gamemodes/tictactoe/TicTacToe";
import { DescribeInOneWord } from "../../../gamemodes/DescribeInOneWord";
import { DefaultStyle } from "../../../css/Style";
import { AlertContext } from "../../Functional/AlertProvider";

interface Props extends WithStyles<typeof DefaultStyle> {}

interface State {
    nextTask: string | null;
    taskType: string | null;
    target: string | null;
    isHost: boolean;
    pollState: boolean;
    evalState: boolean;
    result: Player[] | undefined;
    countdownTimeout: NodeJS.Timeout | undefined;
    penalty: number;
}

class MixedClass extends React.Component<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    leaderboardRef: RefObject<Leaderboard>;

    countdownRef: RefObject<HTMLSpanElement>;

    taskRef: RefObject<WhoWouldRather>;

    resultRef: RefObject<ResultPage>;

    truthOrDareRef: RefObject<TruthOrDare>;

    kickListRef: RefObject<KickList>;

    lang: string;

    constructor(props: Props) {
        super(props);
        this.state = {
            nextTask: null,
            taskType: null,
            target: null,
            isHost: false,
            pollState: false,
            evalState: false,
            countdownTimeout: undefined,
            result: undefined,
            penalty: 0,
        };

        this.leaderboardRef = React.createRef();
        this.countdownRef = React.createRef();
        this.taskRef = React.createRef();
        this.resultRef = React.createRef();
        this.truthOrDareRef = React.createRef();
        this.kickListRef = React.createRef();

        const cookies = new Cookies();
        this.lang = cookies.get("locale");
    }

    componentDidMount(): void {
        GameManager.joinGame(this.gameEvent, this.playerEvent).catch(console.error);
        GameManager.amIHost()
            .then((host): void => {
                return this.setState({ isHost: host });
            })
            .catch(console.error);

        firebase.messaging().onMessage(this.onMessage);
    }

    onMessage = (payload: firebase.messaging.MessagePayload): void => {
        console.log(payload);
    };

    setTask = (taskType: Task, target: PlayerList, penalty = 0): void => {
        console.log(target);
        if (taskType.id === "tictactoe") {
            GameManager.getGame()
                .update({
                    currentTask: null,
                    type: taskType.id,
                    evalState: false,
                    pollState: false,
                    taskTarget: null,
                    penalty,
                })
                .catch(console.error);
            if (target && target.length === 2) {
                TicUtils.registerTicTacToe(target).catch(console.error);
            }
        } else if (taskType.id === "describe_in_one_word") {
            console.log("DIOW");
        } else {
            const lang = this.lang in taskType.lang ? this.lang : taskType.lang[0];
            const localTarget = target ? target[0] : null;

            this.setState({
                target: localTarget,
            });
            getRandomTask(taskType.id, lang)
                .then(
                    (task): Promise<void> => {
                        this.setState({ nextTask: task });
                        return GameManager.getGame().update({
                            currentTask: task,
                            type: taskType.id,
                            evalState: false,
                            pollState: false,
                            taskTarget: localTarget,
                            penalty,
                        });
                    },
                )
                .catch(console.error);
        }
    };

    startTimer = (duration: number, display: RefObject<HTMLSpanElement>): void => {
        let timer = duration;
        const timeout = setInterval(() => {
            const cur = display.current;
            if (cur) {
                cur.textContent = timer.toString();
            }

            if (--timer < 0) {
                const tout = this.state.countdownTimeout;
                if (tout) {
                    clearTimeout(tout);
                }
                this.setState({
                    pollState: false,
                    countdownTimeout: undefined,
                });
                if (this.state.isHost) {
                    GameManager.setPollState(false).catch(console.error);
                    GameManager.setEvalState(true).catch(console.error);
                }
            }
        }, 1000);
        this.setState({
            countdownTimeout: timeout,
        });
    };

    updateLeaderboard = (): void => {
        const lb = this.leaderboardRef.current;
        if (lb) {
            lb.updateLeaderboard();
        }
    };

    gameEvent = (doc: firebase.firestore.DocumentSnapshot<Game>): void => {
        const data = doc.data();
        if (data) {
            if (
                this.state.nextTask !== data.currentTask ||
                this.state.taskType !== data.type ||
                this.state.target !== data.taskTarget
            ) {
                this.submitAndReset();
                this.setState({
                    nextTask: data.currentTask ? data.currentTask : data.type,
                    taskType: data.type,
                    target: data.taskTarget,
                    penalty: data.penalty,
                });
            }
            if (!this.state.pollState && data.pollState) {
                this.startTimer(20, this.countdownRef);
                this.setState({
                    pollState: true,
                });
                if (this.taskRef.current) {
                    this.taskRef.current.lockInput(false);
                }
            }

            if (!this.state.evalState && data.evalState) {
                this.setState({
                    evalState: true,
                });
                if (this.state.taskType === "truthordare") {
                    this.updateLeaderboard();
                } else {
                    GameManager.evaluateAnswers()
                        .then((result) => {
                            this.setState({
                                result,
                            });
                            const res = this.resultRef.current;
                            if (res) {
                                res.updateResults(result);
                            }
                            return Promise.resolve();
                        })
                        .catch(console.error);
                }
            }

            if (!data.evalState) {
                this.setState({
                    evalState: false,
                });
            }

            if (!data.pollState && this.taskRef.current) {
                this.taskRef.current.lockInput(true);
            }
        }
    };

    submitAndReset = (): void => {
        const resultsWere = this.state.result;
        if (resultsWere) {
            GameManager.afterEval(resultsWere)
                .then(() =>
                    this.setState({
                        result: undefined,
                    }),
                )
                .catch(console.error);
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
    };

    playerEvent = (doc: firebase.firestore.DocumentSnapshot<Register>): void => {
        GameManager.updatePlayerLookupTable(doc);
        this.updateLeaderboard();
    };

    randomButtonClick = (): void => {
        if (!this.state.isHost) {
            throw new Error("Trying to execute a host method as non Host");
        }
        this.submitAndReset();
        const testMode = true;
        const development = process.env.NODE_ENV === "development" && testMode;
        const taskType: Task = development ? tasks[3] : Util.selectRandom(tasks);

        if (taskType.singleTarget) {
            let targetCount = 1;
            if (taskType.id === "tictactoe") {
                targetCount = 2;
            }
            const target = GameManager.getRandomPlayer(targetCount);
            this.setTask(taskType, target, Util.random(3, 7));
        } else {
            this.setTask(taskType, null);
        }
    };

    render(): JSX.Element {
        let taskComponent: ReactElement = <FormattedMessage id="elements.tasks.notloaded" />;

        const task = this.state.nextTask;
        const type = this.state.taskType;

        const { classes } = this.props;

        if (task && type) {
            switch (type) {
                case "whowouldrather": {
                    taskComponent = <WhoWouldRather question={task} ref={this.taskRef} />;
                    break;
                }
                case "truthordare": {
                    const { target } = this.state;
                    if (target !== null) {
                        taskComponent = (
                            <TruthOrDare
                                ref={this.truthOrDareRef}
                                question={task}
                                target={target}
                                penalty={this.state.penalty}
                            />
                        );
                    }
                    break;
                }
                case "tictactoe": {
                    console.log("TicTacToe");
                    taskComponent = <TicTacToe />;
                    break;
                }
                case "describe_in_one_word": {
                    const { target, nextTask } = this.state;
                    if (target && nextTask) {
                        taskComponent = <DescribeInOneWord target={target} word={nextTask} />;
                    }
                    break;
                }
                default: {
                    console.error("Unexpected task type!");
                }
            }
        }

        return (
            <div className="w3-center">
                <FormattedMessage id="gamemodes.mixed" />
                <div>
                    <span className="countdown-inner" ref={this.countdownRef}>
                        20
                    </span>{" "}
                    <FormattedMessage id="general.seconds" />
                </div>
                {taskComponent}
                <ResultPage ref={this.resultRef} />
                {this.state.isHost && (
                    <div className="host-area">
                        {!this.state.pollState && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.randomButtonClick}
                                className={classes.margin}
                            >
                                Random Button
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.margin}
                            onClick={() => {
                                GameManager.transferHostShip().catch(console.error);
                            }}
                        >
                            <FormattedMessage id="actions.host.transfer" />
                        </Button>
                        {!this.state.pollState && (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.margin}
                                onClick={() => {
                                    GameManager.setPollState(true).catch(console.error);
                                }}
                            >
                                <FormattedMessage id="actions.host.startpoll" />
                            </Button>
                        )}
                        <br />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.margin}
                            onClick={() => {
                                const klRef = this.kickListRef.current;
                                if (klRef) {
                                    klRef.show();
                                }
                            }}
                        >
                            <FormattedMessage id="actions.host.kick" />
                        </Button>
                        <KickList ref={this.kickListRef} />
                    </div>
                )}
                <Leaderboard ref={this.leaderboardRef} />
            </div>
        );
    }
}

export const Mixed = withStyles(DefaultStyle)(MixedClass);
Mixed.displayName = "MixedGamemodeWithStyle";
