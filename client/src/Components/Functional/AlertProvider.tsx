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
import { withStyles, WithStyles } from "@material-ui/styles";
import { OptionsObject, SnackbarKey, SnackbarMessage, withSnackbar } from "notistack";
import { Alert as IAlert, AlertContextType } from "../../helper/AlertTypes";
import { DefaultStyle } from "../../css/Style";

interface Props extends WithStyles<typeof DefaultStyle> {
    enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
    closeSnackbar: (key?: SnackbarKey) => void;
}

export const AlertContext = React.createContext<AlertContextType>({
    createAlert: () => {
        console.error("Tried to create alert on unmounted AlertProvider!");
    },
});
AlertContext.displayName = "AlertContext";

class AlertProviderRaw extends Component<Props> {
    createAlert = (type: IAlert, message: string | ReactElement): void => {
        this.props.enqueueSnackbar(message, {
            variant: type.variant,
            preventDuplicate: true,
        });
    };

    render(): JSX.Element {
        return (
            <AlertContext.Provider value={{ createAlert: this.createAlert }}>
                {this.props.children}
            </AlertContext.Provider>
        );
    }
}

export const AlertProviderWithStyle = withStyles(DefaultStyle)(AlertProviderRaw);
AlertProviderWithStyle.displayName = "AlertProviderWithStyle";

export const AlertProvider = withSnackbar(AlertProviderWithStyle);
