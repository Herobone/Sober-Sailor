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
import React from "react";
import { render } from "@testing-library/react";
import firebase from "firebase/app";
import "firebase/auth";
import { act as domAct } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { LanguageContainer } from "../translations/LanguageContainer";
import { config } from "../helper/config";
import { AlertProvider } from "../Components/Functional/AlertProvider";
import { Alert, AlertContextType, Error, Warning } from "../helper/AlertTypes";
import { Routed } from "../Components/Functional/Routed";
import { responsiveTheme } from "../css/Theme";

firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

let container: HTMLDivElement | undefined;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.append(container);
});

afterEach(() => {
    // cleanup on exiting
    if (container) unmountComponentAtNode(container);
    container?.remove();
    container = undefined;
});

// eslint-disable-next-line jest/expect-expect
test("Renders the App without GAPI", () => {
    domAct(() => {
        render(
            <React.StrictMode>
                <MuiThemeProvider theme={responsiveTheme}>
                    <CssBaseline />
                    <LanguageContainer>
                        <SnackbarProvider maxSnack={4}>
                            <AlertProvider>
                                <Routed />
                            </AlertProvider>
                        </SnackbarProvider>
                    </LanguageContainer>
                </MuiThemeProvider>
            </React.StrictMode>,
        );
    });
});

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
