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

import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { FormattedMessage } from "react-intl";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Button, Fab, IconButton, TextField } from "@material-ui/core";
import { ArrowForwardIos, ExitToAppRounded } from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { AlertContext } from "./AlertProvider";
import { GameProviderStyle } from "../../css/GameProvider";

interface Props extends WithStyles<typeof GameProviderStyle> {
    gameID?: string;
    gameURL?: string;
}

interface State {
    user: firebase.User | null;
    name: string;
}

class GameProviderClass extends Component<Props, State> {
    static contextType = AlertContext;

    nameInputRef!: React.RefObject<HTMLInputElement>;

    context!: React.ContextType<typeof AlertContext>;

    constructor(props: Props) {
        super(props);

        this.state = {
            user: null,
            name: "",
        };

        this.createGame = this.createGame.bind(this);

        this.nameInputRef = React.createRef();
        this.setName = this.setName.bind(this);

        if (this.props.gameID) {
            localStorage.setItem("gameID", this.props.gameID);
        } else {
            GameManager.removeLocalData();
        }
    }

    componentDidMount(): void {
        const { currentUser } = firebase.auth();
        if (!currentUser) {
            firebase
                .auth()
                .signInAnonymously()
                .catch((error) => {
                    this.context.createAlert(Alerts.ERROR, error.message);
                    console.error(error.message);
                });
        } else {
            this.setState({
                user: currentUser,
            });
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
            } else {
                console.info("Logging out");
            }
        });
    }

    onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            name: event.target.value,
        });
    };

    setName(): void {
        const { currentUser } = firebase.auth();
        const { name } = this.state;

        if (!currentUser) {
            this.context.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            return;
        }

        if (name.length < 2) {
            this.context.createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname" />);
            return;
        }

        currentUser.updateProfile({ displayName: name }).catch(console.error);
        this.forceUpdate();
    }

    createGame(): void {
        if (!this.props.gameURL) {
            this.context.createAlert(Alerts.ERROR, "Fatal error! Unexpected missing Prop!");
            return;
        }
        GameManager.createGame()
            .then((gameID) => {
                window.location.pathname = `/${this.props.gameURL}/${gameID}`;
                return Promise.resolve();
            })
            .catch(console.error);
    }

    render(): JSX.Element {
        const { gameID } = this.props;
        const { user } = this.state;
        const { classes } = this.props;
        if (!gameID) {
            return (
                <div className={classes.centeraligned}>
                    <h1 className={classes.h1}>
                        <FormattedMessage id="sobersailor.name" />
                    </h1>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.createGameButton}
                        onClick={this.createGame}
                        size="large"
                    >
                        <FormattedMessage id="actions.game.create" />
                    </Button>

                    <div className={classes.centeraligned}>
                        <TextField
                            label="GameID"
                            color="secondary"
                            id="outlined-start-adornment"
                            className={classes.inputGameIDField}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">sober-sailor.web.app/</InputAdornment>,
                            }}
                            variant="outlined"
                        />
                        <IconButton
                            color="secondary"
                            className={classes.inputGameIDButton}
                            aria-label="Go to your game!"
                            // onClick={this.goToGame} //goToGame needs to redirect to the game URL
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    </div>
                </div>
            );
        }

        const { currentUser } = firebase.auth();

        if (!user) {
            return <div>Loading...</div>;
        }

        if (currentUser) {
            if (currentUser.displayName && currentUser.displayName !== "") {
                return (
                    <>
                        {this.props.children}
                        <Fab
                            variant="extended"
                            color="primary"
                            onClick={() => GameManager.leaveGame()}
                            className={classes.leaveGameFab}
                        >
                            <ExitToAppRounded />
                            <FormattedMessage id="actions.leave" />
                        </Fab>
                    </>
                );
            }
            return (
                <>
                    <h1>
                        <FormattedMessage id="account.descriptors.finishsignup" />
                    </h1>
                    <br />
                    <TextField
                        ref={this.nameInputRef}
                        required
                        label="Name"
                        variant="outlined"
                        color="primary"
                        className={classes.nameInput}
                        onChange={this.onNameChange}
                        onKeyPress={(event) => {
                            if (event.key === "Enter" || event.key === "Accept") {
                                this.setName();
                            }
                        }}
                    />
                    <br />
                    <Button variant="contained" color="primary" onClick={this.setName}>
                        <FormattedMessage id="general.done" />
                    </Button>
                </>
            );
        }

        return <div>Error</div>;
    }
}

export const GameProvider = withStyles(GameProviderStyle)(GameProviderClass);
