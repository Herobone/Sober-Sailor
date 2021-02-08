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

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { MixedGameProvider } from "./MixedGameProvider";
import { useDefaultStyles } from "../../css/Style";
import { GlobalOverlay } from "../Visuals/GlobalOverlay";
import { Dough } from "../../helper/Dough";

export function Routed(): JSX.Element {
    const classes = useDefaultStyles();

    const [cookieNotice, setCookieNotice] = useState(false);

    useEffect(() => {
        setCookieNotice(!Dough.isDoughPresent());
    }, []);

    return (
        <div className={classes.root}>
            <Router>
                <Dialog
                    open={cookieNotice}
                    onClose={() => console.warn("Can't close on click away")}
                    aria-labelledby="cookie-notice-title"
                    aria-describedby="cookie-notice-description"
                >
                    <DialogTitle id="cookie-notice-title">Allow Cookies</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="cookie-notice-description">
                            Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setCookieNotice(false);
                                Dough.makeDough([]);
                            }}
                            color="secondary"
                            size="small"
                        >
                            Only necessary
                        </Button>
                        <Button
                            onClick={() => {
                                setCookieNotice(false);
                                Dough.makeDough(["analytics", "marketing"]);
                                Dough.startAnalytics();
                            }}
                            color="primary"
                            startIcon={<CheckCircleIcon />}
                            variant="contained"
                            size="large"
                            autoFocus
                        >
                            Allow All
                        </Button>
                    </DialogActions>
                </Dialog>
                <GlobalOverlay />

                <Switch>
                    <Route
                        path="/play/:gameID"
                        render={(props) => (
                            <MixedGameProvider gameID={props.match.params.gameID}>
                                <Mixed />
                            </MixedGameProvider>
                        )}
                    />
                    <Route path="/play" render={() => <MixedGameProvider />} />

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
