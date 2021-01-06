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

// eslint-disable-next-line no-use-before-define
import React, { PureComponent, ReactElement } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Fab, Fade, Modal } from "@material-ui/core";
import { SettingsRounded } from "@material-ui/icons";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Settings } from "../Sites/Settings";
import { Alert } from "../../helper/AlertTypes";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { TruthOrDare } from "../Sites/Gamemodes/TruthOrDare";
import { Saufpoly } from "../Sites/Gamemodes/Saufpoly";
import { GameProvider } from "./GameProvider";
import { TicTacToe } from "../../gamemodes/tictactoe/TicTacToe";
import { DefaultStyle } from "../../css/Style";

interface Props extends WithStyles<typeof DefaultStyle> {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}
interface State {
    settingsShown: boolean;
}

class RoutedClass extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            settingsShown: false,
        };
    }

    render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Router>
                    <Modal
                        open={this.state.settingsShown}
                        onClose={() => this.setState({ settingsShown: false })}
                        closeAfterTransition
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={this.state.settingsShown}>
                            <div className={classes.settingsModal}>
                                <Settings
                                    changeLanguage={this.props.changeLanguage}
                                    currentLocale={this.props.currentLocale}
                                    createAlert={this.props.createAlert}
                                />
                            </div>
                        </Fade>
                    </Modal>

                    <Fab
                        onClick={() =>
                            this.setState((prev) => {
                                return {
                                    settingsShown: !prev.settingsShown,
                                };
                            })
                        }
                        className={classes.settingsButton}
                        color="primary"
                    >
                        <SettingsRounded />
                    </Fab>
                    <Switch>
                        <Route
                            path="/mixed/:gameID"
                            render={(props) => (
                                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                                    <Mixed createAlert={this.props.createAlert} />
                                </GameProvider>
                            )}
                        />
                        <Route
                            path="/truthordare/:gameID"
                            render={(props) => (
                                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                                    <TruthOrDare
                                        createAlert={this.props.createAlert}
                                        gameID={props.match.params.gameID}
                                    />
                                </GameProvider>
                            )}
                        />

                        <Route
                            path="/saufpoly/:gameID"
                            render={(props) => (
                                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                                    <Saufpoly createAlert={this.props.createAlert} gameID={props.match.params.gameID} />
                                </GameProvider>
                            )}
                        />
                        <Route
                            path="/mixed"
                            render={() => <GameProvider createAlert={this.props.createAlert} gameURL="mixed" />}
                        />
                        <Route
                            path="/truthordare"
                            render={() => <GameProvider createAlert={this.props.createAlert} gameURL="truthordare" />}
                        />
                        <Route
                            path="/saufpoly"
                            render={() => <GameProvider createAlert={this.props.createAlert} gameURL="saufpoly" />}
                        />

                        <Route path="/ttt">
                            <TicTacToe />
                        </Route>

                        <Route path="/login">
                            <Login createAlert={this.props.createAlert} />
                        </Route>

                        <Route path="/logout">
                            <Logout createAlert={this.props.createAlert} />
                        </Route>

                        <Route path="/settings">
                            <Settings
                                changeLanguage={this.props.changeLanguage}
                                currentLocale={this.props.currentLocale}
                                createAlert={this.props.createAlert}
                            />
                        </Route>

                        <Route path="/">
                            <Home createAlert={this.props.createAlert} />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export const Routed = withStyles(DefaultStyle)(RoutedClass);
