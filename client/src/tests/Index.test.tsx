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
import { act as domAct } from "react-dom/test-utils";
import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { Provider } from "react-redux";
import { LanguageContainer } from "../translations/LanguageContainer";
import { firebaseApp } from "../helper/config";
import { Alert, AlertContextType, Error, Warning } from "../helper/AlertTypes";
import { Routed } from "../Components/Functional/Routed";
import { CalmTheme } from "../style/Theme";
import { store } from "../state/store";

const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence).catch(console.error);

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
                <StyledEngineProvider injectFirst>
                    <Provider store={store}>
                        <ThemeProvider theme={CalmTheme}>
                            <CssBaseline />
                            <AlertContext.Provider value={{ createAlert: alertFN }}>
                                <LanguageContainer>
                                    <Routed />
                                </LanguageContainer>
                            </AlertContext.Provider>
                        </ThemeProvider>
                    </Provider>
                </StyledEngineProvider>
            </React.StrictMode>,
        );
    });
    expect(neverCallThis).not.toBeCalled();
});
