import firebase from "firebase";
import React, { Component, ReactElement } from "react";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import Alerts, { Alert } from "../../helper/AlertTypes";

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
