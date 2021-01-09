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

import React, { Component, RefObject } from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { AlertProvider } from "./Components/Functional/AlertProvider";

import { LanguageContainer } from "./translations/LanguageContainer";
import "./css/index.css";
import { Routed } from "./Components/Functional/Routed";
import { responsiveTheme } from "./css/Theme";

interface Props {}

interface State {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
}

export class App extends Component<Props, State> {
    langRef: RefObject<LanguageContainer>;

    constructor(props: Props) {
        super(props);

        this.state = {
            changeLanguage: () => {
                console.error("Tried to create alert on unmounted LanguageContainer!");
            },
            currentLocale: "en",
        };

        this.langRef = React.createRef();
    }

    componentDidMount(): void {
        if (this.langRef.current) {
            this.setState({
                changeLanguage: this.langRef.current.changeLanguage,
                currentLocale: this.langRef.current.getCurrentLocale(),
            });
        }
    }

    render(): JSX.Element {
        return (
            <React.StrictMode>
                <MuiThemeProvider theme={responsiveTheme}>
                    <CssBaseline />
                    <LanguageContainer ref={this.langRef}>
                        <SnackbarProvider maxSnack={4}>
                            <AlertProvider>
                                <Routed
                                    changeLanguage={this.state.changeLanguage}
                                    currentLocale={this.state.currentLocale}
                                />
                            </AlertProvider>
                        </SnackbarProvider>
                    </LanguageContainer>
                </MuiThemeProvider>
            </React.StrictMode>
        );
    }
}
