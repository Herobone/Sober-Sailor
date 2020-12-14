import firebase from 'firebase';
import React, {Component, ReactElement} from 'react';
import {Redirect} from 'react-router';
import * as gapiHelpers from '../../helper/gapiHelpers';
import Alerts, {Alert} from '../../helper/AlertTypes';
import {FormattedMessage} from 'react-intl';

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

export default class Logout extends Component<Props> {

    componentDidMount() {
        gapiHelpers.signOutGAPI();
        firebase.auth().signOut()
            .then(() => {
                this.props.createAlert(Alerts.SUCCESS, <FormattedMessage id="account.descriptions.signout.success"/>);
            })
            .catch(() => {
                this.props.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen"/>);
            });
    }

    render() {
        return (
            <Redirect to="/login"/>
        )
    }
}
