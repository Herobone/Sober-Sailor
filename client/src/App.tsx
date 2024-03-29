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
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import Cookies from "universal-cookie";
import { AlertProvider } from "./Components/Functional/AlertProvider";

import { LanguageContainer } from "./translations/LanguageContainer";
import { Routed } from "./Components/Functional/Routed";
import {
    AvailableThemes,
    CalmTheme,
    DarkTheme,
    HackerTheme,
    HighContrastTheme,
    MinimalistTheme,
    StandardTheme,
} from "./style/Theme";
import { store } from "./state/store";
import { useFiller, useThemeSetting } from "./state/actions/settingActions";
import { Filler } from "./state/reducers/settingReducer";
import backgroundName from "./media/BackgroundWithName.png";
import background from "./media/Background.png";
import { useBackgroundState } from "./state/actions/displayStateActions";

export function App(): JSX.Element {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <AppWithStore />
            </Provider>
        </React.StrictMode>
    );
}

function AppWithStore(): JSX.Element {
    const cookies: Cookies = new Cookies();
    const [theme, setTheme] = useThemeSetting();
    const [muiTheme, setMuiTheme] = useState(CalmTheme);

    const [backgroundState] = useBackgroundState();

    const setFiller = useFiller()[1];

    useEffect(() => {
        const themeFromCookie: AvailableThemes | undefined = cookies.get("theme");
        if (themeFromCookie) setTheme(themeFromCookie);

        const fillerFromCookie: Filler | undefined = cookies.get("filler");
        if (fillerFromCookie) setFiller(fillerFromCookie);
    }, []);

    useEffect(() => {
        switch (theme) {
            case "calm":
                setMuiTheme(CalmTheme);
                break;
            case "dark":
                setMuiTheme(DarkTheme);
                break;
            case "light":
                setMuiTheme(StandardTheme);
                break;
            case "highcontrast":
                setMuiTheme(HighContrastTheme);
                break;
            case "hacker":
                setMuiTheme(HackerTheme);
                break;
            case "minimalist":
                setMuiTheme(MinimalistTheme);
                break;
            default:
                setMuiTheme(CalmTheme);
                break;
        }
    }, [theme]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
                <div
                    style={{
                        zIndex: -1,
                        filter: backgroundState ? "blur(4px)" : "none",
                        position: "absolute",
                        backgroundImage: `url(${backgroundState ? background : backgroundName})`,
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        backgroundSize: "cover",
                        width: "100vw",
                        height: "100vh",
                    }}
                />
                <CssBaseline />

                <LanguageContainer>
                    <SnackbarProvider maxSnack={4}>
                        <AlertProvider>
                            <Routed />
                        </AlertProvider>
                    </SnackbarProvider>
                </LanguageContainer>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
