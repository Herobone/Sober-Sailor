import React, {Component, ReactElement} from 'react'
import Column from '../Visuals/Column';
import Dropdown from '../Visuals/Dropdown';
import firebase from 'firebase';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {Alert} from '../../helper/AlertTypes';

interface Props {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

export class Settings extends Component<Props> {

    render() {
        const options = {
            "de": "Deutsch",
            "en": "English",
            "de_AT": "Boarisch"
        };

        const currentUser = firebase.auth().currentUser;

        let userName = "Logged Out";
        if (currentUser && currentUser.displayName) {
            userName = currentUser.displayName;
        }
        return (
            <Column additionalClasses="app-content">
                <h1><FormattedMessage id="account.navigation.settings"/></h1>
                <h3>Hi {userName}!</h3>
                <hr/>
                <h5><FormattedMessage id="settings.labels.selectlanguage"/></h5>
                <Dropdown callback={this.props.changeLanguage} content={options} selected={this.props.currentLocale}/>
                <hr/>
                <br/>
                <Link to="/logout" className="w3-bar-item w3-button w3-red">
                    <FormattedMessage id="account.actions.logout"/>
                </Link>
                <br/>
            </Column>
        )
    }
}

export default Settings
