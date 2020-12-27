import React, { PureComponent, ReactElement } from "react";
import firebase from "firebase";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Dropdown } from "../Visuals/Dropdown";
import { Column } from "../Visuals/Column";
import { Alert } from "../../helper/AlertTypes";
import { Util } from "../../helper/Util";

interface Props {
  changeLanguage: (locale: string) => void;
  currentLocale: string;
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

export class Settings extends PureComponent<Props> {
  render(): JSX.Element {
    const options = {
      de: "Deutsch",
      en: "English",
      de_AT: "Boarisch",
    };

    const { currentUser } = firebase.auth();

    let userName = "Logged Out";
    if (currentUser && currentUser.displayName) {
      userName = currentUser.displayName;
    }
    return (
      <Column additionalClasses="app-content">
        <h1>
          <FormattedMessage id="account.navigation.settings" />
        </h1>
        <h3>Hi{userName}!</h3>
        <hr />
        <h5>
          <FormattedMessage id="settings.labels.selectlanguage" />
        </h5>
        <Dropdown callback={this.props.changeLanguage} content={Util.objToStrMap(options)} selected={this.props.currentLocale} />
        <hr />
        <br />
        <Link to="/logout" className="w3-bar-item w3-button w3-red">
          <FormattedMessage id="account.actions.logout" />
        </Link>
        <br />
      </Column>
    );
  }
}
