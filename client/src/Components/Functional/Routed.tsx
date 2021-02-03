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

import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Backdrop, Fade, Modal } from "@material-ui/core";
import { SettingsRounded } from "@material-ui/icons";
import SpeedDial from "@material-ui/lab/SpeedDial";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CopyrightIcon from "@material-ui/icons/Copyright";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { withStyles } from "@material-ui/styles";
import { SpeedDialAction } from "@material-ui/lab";
import { Settings } from "../Sites/Settings";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { GameProvider } from "./GameProvider";
import { DefaultStyle, useDefaultStyles } from "../../css/Style";

export function RoutedClass(): JSX.Element {
    const classes = useDefaultStyles();
    const [settingsShown, setSettingsShown] = useState(false);
    const [speedDialShown, setSpeedDialShown] = useState(false);

    return (
        <div className={classes.root}>
            <Router>
                <Modal
                    open={settingsShown}
                    onClose={() => setSettingsShown(false)}
                    closeAfterTransition
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={settingsShown}>
                        <div className={classes.settingsModal}>
                            <Settings />
                        </div>
                    </Fade>
                </Modal>
                <Backdrop open={speedDialShown} />
                <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    className={classes.settingsButton}
                    icon={<MenuOpenIcon />}
                    onClose={() => setSpeedDialShown(false)}
                    onOpen={() => setSpeedDialShown(true)}
                    open={speedDialShown}
                >
                    <SpeedDialAction
                        key="Settings"
                        icon={<SettingsRounded />}
                        tooltipTitle="Settings"
                        title="Settings"
                        tooltipOpen
                        onClick={() => {
                            setSpeedDialShown(false);
                            setSettingsShown(!settingsShown);
                        }}
                    />
                    <SpeedDialAction
                        key="Info"
                        icon={<InfoOutlinedIcon />}
                        tooltipTitle="Info"
                        title="Info"
                        tooltipOpen
                        onClick={() => {
                            setSpeedDialShown(false);
                        }}
                    />
                    <SpeedDialAction
                        key="Credits"
                        icon={<CopyrightIcon />}
                        tooltipTitle="Credits"
                        title="Credits"
                        tooltipOpen
                        onClick={() => {
                            setSpeedDialShown(false);
                        }}
                    />
                </SpeedDial>
                <Switch>
                    <Route
                        path="/mixed/:gameID"
                        render={(props) => (
                            <GameProvider gameID={props.match.params.gameID}>
                                <Mixed />
                            </GameProvider>
                        )}
                    />
                    <Route path="/mixed" render={() => <GameProvider gameURL="mixed" />} />

                    <Route path="/login">
                        <Login />
                    </Route>

                    <Route path="/logout">
                        <Logout />
                    </Route>

                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export const Routed = withStyles(DefaultStyle)(RoutedClass);
