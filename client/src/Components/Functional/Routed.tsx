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

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../Sites/Home";
import { useDefaultStyles } from "../../style/Style";
import { GlobalOverlay } from "../Visuals/GlobalOverlay";
import { LoadingIcon } from "../Visuals/LoadingIcon";
import { MixedGameProvider } from "./MixedGameProvider";
import { Logout } from "./Logout";

const Mixed = lazy(() => import("../Sites/Gamemodes/Mixed"));

export function Routed(): JSX.Element {
    const classes = useDefaultStyles();

    return (
        <div className={classes.root}>
            <GlobalOverlay />
            <Router>
                <Suspense fallback={<LoadingIcon />}>
                    <Routes>
                        <Route path="play/*" element={<MixedGameProvider />}>
                            <Route path=":gameID" element={<Mixed />} />
                        </Route>

                        {/*<Route path="/login">
                            <Login />
                        </Route>*/}

                        <Route path="logout" element={<Logout />} />

                        <Route path="/" element={<Home />} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}
