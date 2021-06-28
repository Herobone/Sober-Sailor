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

import firebase from "firebase/app";
import "firebase/auth";
import React, { Component } from "react";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import { Alerts } from "../../helper/AlertTypes";
import { AlertContext } from "./AlertProvider";

export class Logout extends Component {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    componentDidMount(): void {
        firebase
            .auth()
            .signOut()
            .then(() => this.context.createAlert(
                    Alerts.SUCCESS,
                    <FormattedMessage id="account.descriptions.signout.success" />,
                ))
            .catch(() => {
                this.context.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            });
    }

    render(): JSX.Element {
        return <Redirect to="/login" />;
    }
}
