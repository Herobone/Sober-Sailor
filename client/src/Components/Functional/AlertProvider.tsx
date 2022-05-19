/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import React, { ReactElement } from "react";
import { useSnackbar } from "notistack";
import { Alert as IAlert, AlertContextType } from "../../helper/AlertTypes";

export const AlertContext = React.createContext<AlertContextType>({
    createAlert: () => {
        console.error("Tried to create alert on unmounted AlertProvider!");
    },
});
AlertContext.displayName = "AlertContext";

export const useAlert = (): AlertContextType => React.useContext(AlertContext);

export function AlertProvider(props: React.PropsWithChildren<unknown>): JSX.Element {
    const snackbar = useSnackbar();

    /***
     * Creates an notistack alert
     * @param type      Type of the alert
     * @param message   Message of alert
     */
    const createAlert = (type: IAlert, message: string | ReactElement): void => {
        snackbar.enqueueSnackbar(message, {
            variant: type.variant,
            preventDuplicate: true,
        });
    };

    return <AlertContext.Provider value={{ createAlert }}>{props.children}</AlertContext.Provider>;
}
