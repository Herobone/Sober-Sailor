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
import { Redirect } from "react-router";
import Cookies from "universal-cookie";
import { getAuth, signOut } from "firebase/auth";
import { Alerts } from "../../helper/AlertTypes";
import { firebaseApp } from "../../helper/config";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { useAlert } from "./AlertProvider";

export function Logout(): JSX.Element {
    const { createAlert } = useAlert();
    const [redirect, setRedirect] = useState(false);
    useEffect((): void => {
        signOut(getAuth(firebaseApp))
            .then(() => {
                createAlert(Alerts.SUCCESS, <TranslatedMessage id="account.descriptions.signout.success" />);
                // Delete cookie that saves the global account.
                const cookies = new Cookies();
                cookies.remove("globalAccount");
                setRedirect(true);
                return Promise.resolve();
            })
            .catch(() => {
                createAlert(Alerts.ERROR, <TranslatedMessage id="general.shouldnothappen" />);
            });
    });

    return (
        <>
            Logging out...
            {redirect && <Redirect to="/" />}
        </>
    );
}
