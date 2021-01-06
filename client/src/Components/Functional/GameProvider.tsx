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

import React, { Component, ReactElement } from "react";
import firebase from "firebase";
import { FormattedMessage } from "react-intl";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Button, Fab, TextField } from "@material-ui/core";
import { ExitToAppRounded } from "@material-ui/icons";
import { Alerts, Alert } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { DefaultStyle } from "../../css/Style";

interface Props extends WithStyles<typeof DefaultStyle> {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID?: string;
    gameURL?: string;
}

interface State {
    user: firebase.User | null;
    name: string;
}

class GameProviderClass extends Component<Props, State> {
    nameInputRef!: React.RefObject<HTMLInputElement>;

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
            localStorage.removeItem("gameID");
        }
    }

    componentDidMount(): void {
        const { currentUser } = firebase.auth();
        if (!currentUser) {
            firebase
                .auth()
                .signInAnonymously()
                .catch((error) => {
                    this.props.createAlert(Alerts.ERROR, error.message);
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
            this.props.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            return;
        }

        if (name.length < 2) {
            this.props.createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname" />);
            return;
        }

        currentUser.updateProfile({ displayName: name }).catch(console.error);
        this.forceUpdate();
    }

    createGame(): void {
        if (!this.props.gameURL) {
            this.props.createAlert(Alerts.ERROR, "Fatal error! Unexpected missing Prop!");
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
                <Button variant="contained" color="primary" onClick={this.createGame}>
                    <FormattedMessage id="actions.game.create" />
                </Button>
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
                    <p>
                        <TextField
                            ref={this.nameInputRef}
                            required
                            label="Name"
                            variant="outlined"
                            color="primary"
                            style={{ width: "40%" }}
                            onChange={this.onNameChange}
                            onKeyPress={(event) => {
                                if (event.key === "Enter" || event.key === "Accept") {
                                    this.setName();
                                }
                            }}
                        />
                    </p>
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

export const GameProvider = withStyles(DefaultStyle)(GameProviderClass);
