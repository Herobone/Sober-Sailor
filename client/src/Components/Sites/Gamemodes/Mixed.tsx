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

import React, { ElementRef, ReactElement, RefObject } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase/app";
import "firebase/firestore";
import Cookies from "universal-cookie";

import { Tooltip } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Zoom from "@material-ui/core/Zoom";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import IconButton from "@material-ui/core/IconButton";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import PollIcon from "@material-ui/icons/Poll";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
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
    timer: number;
    maxTime: number;
    penalty: number;
}
type LeaderboardHandle = ElementRef<typeof Leaderboard>;
type TruthOrDareHandle = ElementRef<typeof TruthOrDare>;
type KickListHandle = ElementRef<typeof KickList>;
type WhoWouldRatherHandle = ElementRef<typeof WhoWouldRather>;

class MixedClass extends React.Component<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    leaderboardRef: RefObject<LeaderboardHandle>;

    taskRef: RefObject<WhoWouldRatherHandle>;

    truthOrDareRef: RefObject<TruthOrDareHandle>;

    kickListRef: RefObject<KickListHandle>;

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
            timer: 0,
            maxTime: 0,
        };

        this.leaderboardRef = React.createRef();
        this.taskRef = React.createRef();
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
    }

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

    startTimer = (duration: number): void => {
        let timer = duration;
        this.setState({ maxTime: duration });
        const timeout = setInterval(() => {
            this.setState({
                timer,
            });

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
                this.startTimer(20);
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
        const testMode = false;
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
                    const { target } = this.state;
                    if (target !== null) {
                        taskComponent = <DescribeInOneWord target={target} />;
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
                <ResultPage result={this.state.result} />
                <Grid container spacing={3} className={classes.mainGrid}>
                    <Grid item xs={6}>
                        <div className={classes.mainHeadingName}>
                            <FormattedMessage id="sobersailor.name" />
                        </div>
                    </Grid>
                    <Grid item xs={8} lg={9}>
                        <Paper>{taskComponent}</Paper>
                    </Grid>
                    <Grid item xs={4} lg={3}>
                        {this.state.isHost && (
                            <Paper className={classes.sideArea}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <h2 className={classes.sideHeading}>
                                            <FormattedMessage id="elements.admin.control" />
                                        </h2>
                                    </Grid>
                                    {!this.state.pollState && (
                                        <Grid item xs>
                                            <Tooltip
                                                title="Next Question"
                                                TransitionComponent={Zoom}
                                                placement="bottom"
                                                arrow
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    className={classes.hostButton}
                                                    onClick={this.randomButtonClick}
                                                >
                                                    <QueuePlayNextIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                    <Grid item xs>
                                        <Tooltip
                                            title={<FormattedMessage id="actions.host.transfer" />}
                                            TransitionComponent={Zoom}
                                            placement="bottom"
                                            arrow
                                        >
                                            <IconButton
                                                color="secondary"
                                                className={classes.hostButton}
                                                onClick={() => {
                                                    GameManager.transferHostShip().catch(console.error);
                                                }}
                                            >
                                                <TransferWithinAStationIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    {!this.state.pollState && (
                                        <Grid item xs>
                                            <Tooltip
                                                title={<FormattedMessage id="actions.host.startpoll" />}
                                                TransitionComponent={Zoom}
                                                placement="bottom"
                                                arrow
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    className={classes.hostButton}
                                                    onClick={() => {
                                                        GameManager.setPollState(true).catch(console.error);
                                                    }}
                                                >
                                                    <PollIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                    <br />
                                    <Grid item xs>
                                        <Tooltip
                                            title={<FormattedMessage id="actions.host.kick" />}
                                            TransitionComponent={Zoom}
                                            placement="bottom"
                                            arrow
                                        >
                                            <IconButton
                                                color="secondary"
                                                className={classes.hostButton}
                                                onClick={() => {
                                                    const klRef = this.kickListRef.current;
                                                    if (klRef) {
                                                        klRef.show();
                                                    }
                                                }}
                                            >
                                                <FlightTakeoffIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                        <Paper className={classes.sideArea}>
                            <Leaderboard ref={this.leaderboardRef} />
                        </Paper>

                        <KickList ref={this.kickListRef} />
                    </Grid>
                </Grid>
                <div>
                    <span className="countdown-inner">{this.state.timer}</span>{" "}
                    <FormattedMessage id="general.seconds" />
                    <LinearProgress variant="determinate" value={(this.state.timer / this.state.maxTime) * 100} />
                </div>
            </div>
        );
    }
}

export const Mixed = withStyles(DefaultStyle)(MixedClass);
Mixed.displayName = "MixedGamemodeWithStyle";
