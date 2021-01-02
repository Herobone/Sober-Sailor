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

import React, { Component, ReactElement, RefObject } from "react";
import { AlertProvider } from "./Components/Functional/AlertProvider";
import { LanguageContainer } from "./translations/LanguageContainer";
import "./css/index.css";
import { Routed } from "./Components/Functional/Routed";
import { Alert } from "./helper/AlertTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface State {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    changeLanguage: (locale: string) => void;
    currentLocale: string;
}

export class App extends Component<Props, State> {
    alertRef: RefObject<AlertProvider>;

    langRef: RefObject<LanguageContainer>;

    constructor(props: Props) {
        super(props);

        this.state = {
            createAlert: () => {
                console.error("Tried to create alert on unmounted AlertProvider!");
            },
            changeLanguage: () => {
                console.error("Tried to create alert on unmounted LanguageContainer!");
            },
            currentLocale: "en",
        };

        this.alertRef = React.createRef();
        this.langRef = React.createRef();
    }

    componentDidMount(): void {
        if (this.alertRef.current) {
            this.setState({ createAlert: this.alertRef.current.createAlert });
        }
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
                <LanguageContainer ref={this.langRef}>
                    <AlertProvider ref={this.alertRef}>
                        <Routed
                            changeLanguage={this.state.changeLanguage}
                            currentLocale={this.state.currentLocale}
                            createAlert={this.state.createAlert}
                        />
                    </AlertProvider>
                </LanguageContainer>
            </React.StrictMode>
        );
    }
}
