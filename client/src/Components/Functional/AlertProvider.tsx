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

import React, { Component, ReactElement } from "react";
import { Alert as IAlert } from "../../helper/AlertTypes";
import { Alert } from "../Visuals/Alert";

interface State {
    errorToDisplay: Map<number, ReactElement>;
    lastIndex: number;
}

interface Props {}

export class AlertProvider extends Component<Props, State> {
    maxAlerts = 5;

    alertLifetime = 5000;

    clearAlerts: Map<number, NodeJS.Timeout> = new Map();

    constructor(props: Props) {
        super(props);
        this.state = {
            errorToDisplay: new Map<number, ReactElement>(),
            lastIndex: 0,
        };
    }

    componentWillUnmount(): void {
        this.clearAlerts.forEach((timeout) => clearTimeout(timeout));
    }

    prepareAlerts = (): ReactElement[] => {
        const values: ReactElement[] = [];
        this.state.errorToDisplay.forEach((val: ReactElement): void => {
            values.push(val);
        });
        return values;
    };

    clearAlert = (alertIndex: number): void => {
        this.setState((prev) => {
            const errorToDisplayClear = prev.errorToDisplay;

            errorToDisplayClear.delete(alertIndex);
            return {
                errorToDisplay: errorToDisplayClear,
            };
        });
        this.clearAlerts.delete(alertIndex);
    };

    createAlert = (type: IAlert, message: string | ReactElement, header?: ReactElement): void => {
        const { errorToDisplay, lastIndex } = this.state;
        const alertIndex = lastIndex + 1;
        const al = (
            <Alert key={`alert${alertIndex}`} type={type} header={header} clear={() => this.clearAlert(alertIndex)}>
                {message}
            </Alert>
        );
        if (errorToDisplay.size + 1 > this.maxAlerts) {
            errorToDisplay.delete(lastIndex - (this.maxAlerts - 1));
        }
        this.clearAlerts.set(
            alertIndex,
            setTimeout(() => this.clearAlert(alertIndex), this.alertLifetime),
        );
        errorToDisplay.set(alertIndex, al);
        this.setState({
            errorToDisplay,
            lastIndex: alertIndex,
        });
    };

    render(): JSX.Element {
        return (
            <div>
                <div className="w3-container w3-content">
                    <div className="alert-area">{this.prepareAlerts()}</div>
                </div>
                {this.props.children}
            </div>
        );
    }
}
