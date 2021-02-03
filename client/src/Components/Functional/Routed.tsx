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

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { GameProvider } from "./GameProvider";
import { useDefaultStyles } from "../../css/Style";
import { GlobalOverlay } from "../Visuals/GlobalOverlay";

export function Routed(): JSX.Element {
    const classes = useDefaultStyles();

    return (
        <div className={classes.root}>
            <Router>
                <GlobalOverlay />

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
