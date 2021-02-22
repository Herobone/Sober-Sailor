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
import { render } from "@testing-library/react";
import firebase from "firebase/app";
import "firebase/auth";
import { act as domAct } from "react-dom/test-utils";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { LanguageContainer } from "../translations/LanguageContainer";
import { config } from "../helper/config";
import { Alert, AlertContextType, Error, Warning } from "../helper/AlertTypes";
import { Routed } from "../Components/Functional/Routed";
import { responsiveTheme } from "../css/Theme";

firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).catch(console.warn);

test("Renders the Router and looks for Alerts", () => {
    const neverCallThis = jest.fn();
    const alertFN = (type: Alert): void => {
        if (type instanceof Warning || type instanceof Error) {
            neverCallThis();
        }
    };

    const AlertContext = React.createContext<AlertContextType>({
        createAlert: (type: Alert) => {
            alertFN(type);
        },
    });

    domAct(() => {
        render(
            <React.StrictMode>
                <MuiThemeProvider theme={responsiveTheme}>
                    <CssBaseline />
                    <AlertContext.Provider value={{ createAlert: alertFN }}>
                        <LanguageContainer>
                            <Routed />
                        </LanguageContainer>
                    </AlertContext.Provider>
                </MuiThemeProvider>
            </React.StrictMode>,
        );
    });
    expect(neverCallThis).not.toBeCalled();
});
