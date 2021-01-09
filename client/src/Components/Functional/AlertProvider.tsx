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
import { withStyles, WithStyles } from "@material-ui/styles";
import { Alert as IAlert, AlertContextType } from "../../helper/AlertTypes";
import { Alert } from "../Visuals/Alert";
import { DefaultStyle } from "../../css/Style";

interface State {
    errorToDisplay: Map<number, ReactElement>;
    lastIndex: number;
}

interface Props extends WithStyles<typeof DefaultStyle> {}

export const AlertContext = React.createContext<AlertContextType>({
    createAlert: () => {
        console.error("Tried to create alert on unmounted AlertProvider!");
    },
});
AlertContext.displayName = "AlertContext";

export const AlertProvider = withStyles(DefaultStyle)(
    class extends Component<Props, State> {
        maxAlerts = 5;

        clearAlerts: Map<number, RefObject<Alert>> = new Map();

        constructor(props: Props) {
            super(props);
            this.state = {
                errorToDisplay: new Map<number, ReactElement>(),
                lastIndex: 0,
            };
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
            const ref: RefObject<Alert> = React.createRef();
            const al = (
                <Alert
                    key={`alert${alertIndex}`}
                    type={type}
                    header={header}
                    ref={ref}
                    clear={() => this.clearAlert(alertIndex)}
                >
                    {message}
                </Alert>
            );
            if (errorToDisplay.size + 1 > this.maxAlerts) {
                const alertRef = this.clearAlerts.get(lastIndex - (this.maxAlerts - 1));
                if (alertRef) {
                    const cur = alertRef.current;
                    if (cur) {
                        cur.close();
                    }
                }
            }
            this.clearAlerts.set(alertIndex, ref);
            errorToDisplay.set(alertIndex, al);
            this.setState({
                errorToDisplay,
                lastIndex: alertIndex,
            });
        };

        render(): JSX.Element {
            return (
                <div className="w3-container w3-content">
                    {this.prepareAlerts()}
                    <AlertContext.Provider value={{ createAlert: this.createAlert }}>
                        {this.props.children}
                    </AlertContext.Provider>
                </div>
            );
        }
    },
);

AlertProvider.displayName = "AlertProvider";
