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

import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import * as firebaseui from "firebaseui";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import Cookies from "universal-cookie";
import { Alerts } from "../../helper/AlertTypes";
import { useAlert } from "../Functional/AlertProvider";
import { Util } from "../../helper/Util";

export function Login(): JSX.Element {
    const { createAlert } = useAlert();

    const [loginState, setLoginState] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);

    // Configure FirebaseUI.
    const uiConfig: firebaseui.auth.Config = {
        // Popup signin flow rather than redirect flow.
        signInFlow: "popup",
        // We will display Google, Email and GitHub as auth providers.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        autoUpgradeAnonymousUsers: true,
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: (): boolean => {
                const cookie = new Cookies();
                cookie.set("globalAccount", true, {
                    sameSite: true,
                    expires: Util.getDateIn(1),
                });

                setLoginState(true);
                setIsAnonymous(false);
                return false;
            },
            signInFailure: (error: firebaseui.auth.AuthUIError): Promise<void> => {
                createAlert(Alerts.ERROR, error.message);
                console.warn(error.message);
                return Promise.resolve();
            },
        },
    };

    const { currentUser } = firebase.auth();
    return (
        <div className="login-page">
            <div>
                <h1 className="w3-center">
                    <FormattedMessage id="general.welcome" />
                    !
                    <br />
                </h1>
                <h3 className="w3-center">
                    <FormattedMessage id="account.descriptors.signinneeded" />
                </h3>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
            {currentUser && loginState && (
                <div>
                    {!isAnonymous && <Redirect to="/" />}
                    Lol
                </div>
            )}
        </div>
    );
}
