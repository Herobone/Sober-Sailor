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

import firebase from "firebase";
import React, { Component, ReactElement } from "react";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import { Alerts, Alert } from "../../helper/AlertTypes";

interface Props {
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

export class Logout extends Component<Props> {
  componentDidMount(): void {
    firebase
      .auth()
      .signOut()
      .then(() => {
        return this.props.createAlert(Alerts.SUCCESS, <FormattedMessage id="account.descriptions.signout.success" />);
      })
      .catch(() => {
        this.props.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
      });
  }

  render(): JSX.Element {
    return <Redirect to="/login" />;
  }
}
