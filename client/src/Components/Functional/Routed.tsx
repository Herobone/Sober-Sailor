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
import React, { PureComponent } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Fab, Fade, Modal } from "@material-ui/core";
import { SettingsRounded } from "@material-ui/icons";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CopyrightOutlinedIcon from '@material-ui/icons/CopyrightOutlined';
import { WithStyles, withStyles } from "@material-ui/styles";
import { Settings } from "../Sites/Settings";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { TruthOrDare } from "../Sites/Gamemodes/TruthOrDare";
import { Saufpoly } from "../Sites/Gamemodes/Saufpoly";
import { GameProvider } from "./GameProvider";
import { TicTacToe } from "../../gamemodes/tictactoe/TicTacToe";
import { DefaultStyle } from "../../css/Style";
import { AlertContext } from "./AlertProvider";

interface Props extends WithStyles<typeof DefaultStyle> {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
}
interface State {
    settingsShown: boolean;
}

class RoutedClass extends PureComponent<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

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
                        color="secondary"
                    >
                    
                        <SettingsRounded />
                    </Fab>
                    <Fab
                        onClick={() =>
                            this.setState((prev) => {
                                return {
                                    // show credits
                                };
                            })
                        }
                        className={classes.infoButton}
                        color="secondary"
                    >
                    
                        <InfoOutlinedIcon />
                    </Fab>
                    <Fab
                        onClick={() =>
                            this.setState((prev) => {
                                return {
                                    // show info about game
                                };
                            })
                        }
                        className={classes.creditsButton}
                        color="secondary"
                    >
                    
                        <CopyrightOutlinedIcon />
                    </Fab>
                    <Switch>
                        <Route
                            path="/mixed/:gameID"
                            render={(props) => (
                                <GameProvider gameID={props.match.params.gameID}>
                                    <Mixed />
                                </GameProvider>
                            )}
                        />
                        <Route
                            path="/truthordare/:gameID"
                            render={(props) => (
                                <GameProvider gameID={props.match.params.gameID}>
                                    <TruthOrDare
                                        createAlert={this.context.createAlert}
                                        gameID={props.match.params.gameID}
                                    />
                                </GameProvider>
                            )}
                        />

                        <Route
                            path="/saufpoly/:gameID"
                            render={(props) => (
                                <GameProvider gameID={props.match.params.gameID}>
                                    <Saufpoly
                                        createAlert={this.context.createAlert}
                                        gameID={props.match.params.gameID}
                                    />
                                </GameProvider>
                            )}
                        />
                        <Route path="/mixed" render={() => <GameProvider gameURL="mixed" />} />
                        <Route path="/truthordare" render={() => <GameProvider gameURL="truthordare" />} />
                        <Route path="/saufpoly" render={() => <GameProvider gameURL="saufpoly" />} />

                        <Route path="/ttt">
                            <TicTacToe />
                        </Route>

                        <Route path="/login">
                            <Login />
                        </Route>

                        <Route path="/logout">
                            <Logout />
                        </Route>

                        <Route path="/settings">
                            <Settings
                                changeLanguage={this.props.changeLanguage}
                                currentLocale={this.props.currentLocale}
                            />
                        </Route>

                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export const Routed = withStyles(DefaultStyle)(RoutedClass);
