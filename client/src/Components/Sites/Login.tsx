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

import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import * as firebaseui from "firebaseui";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import { Alerts } from "../../helper/AlertTypes";
import { AlertContext } from "../Functional/AlertProvider";

interface Props {}

interface State {
    isSignedIn: boolean;
}

export class Login extends Component<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: "redirect",
        // We will display Google, Email and GitHub as auth providers.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: (): boolean => {
                return false;
            },
            signInFailure: (error: firebaseui.auth.AuthUIError): Promise<void> => {
                this.context.createAlert(Alerts.ERROR, error.message);
                console.warn(error.message);
                return new Promise<void>((resolve) => {
                    resolve();
                });
            },
        },
    };

    componentDidMount(): void {
        const { currentUser } = firebase.auth();
        if (currentUser && currentUser.isAnonymous) {
            firebase
                .auth()
                .signOut()
                .then(() => this.forceUpdate())
                .catch(console.error);
            console.info("Logged out of anonymous");
        }
    }

    render(): JSX.Element {
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
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
                {currentUser && (
                    <div>
                        {!currentUser.isAnonymous && <Redirect to="/" />}
                        Lol
                    </div>
                )}
            </div>
        );
    }
}
