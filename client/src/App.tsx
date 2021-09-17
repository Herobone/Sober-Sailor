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
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { AlertProvider } from "./Components/Functional/AlertProvider";

import { LanguageContainer } from "./translations/LanguageContainer";
import { Routed } from "./Components/Functional/Routed";
import { CalmTheme } from "./style/Theme";
import { store } from "./state/store";

export function App(): JSX.Element {
    return (
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={CalmTheme}>
                    <CssBaseline />
                    <Provider store={store}>
                        <LanguageContainer>
                            <SnackbarProvider maxSnack={4}>
                                <AlertProvider>
                                    <Routed />
                                </AlertProvider>
                            </SnackbarProvider>
                        </LanguageContainer>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        </React.StrictMode>
    );
}
