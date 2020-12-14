import React, {Component, ReactElement} from 'react'
import Alerts, {Alert} from '../../helper/AlertTypes';
import config from '../../helper/config';
import firebase from 'firebase';

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
    gapiInitDone: boolean;
    isSignedIn: boolean;
}

export default class GAPIContainer extends Component<Props, State> {

    unregisterAuthObserver!: firebase.Unsubscribe;

    state = {
        gapiInitDone: false,
        isSignedIn: false
    }

    constructor(props: Props) {
        super(props);
        this.initGAPI = this.initGAPI.bind(this);
        this.initAuth2 = this.initAuth2.bind(this);
    }

    componentDidMount() {
        gapi.load("client:auth2", this.initGAPI);
    }

    initGAPI() {
        gapi.client.init({
            apiKey: config.apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scopes.join(' '),
        }).then(() => {
            // Make sure the Google API Client is properly signed in
            console.log("Init successful!");
            this.setState({gapiInitDone: true});
        }, (error: any) => {
            console.log("Error cause: " + error.details)
            this.props.createAlert(Alerts.ERROR, error.details);
        });

        this.initAuth2();
    }

    initAuth2() {
        const auth2 = gapi.auth2.getAuthInstance();
        gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
            if (isSignedIn) {
                console.log("User was signed in!");
                const currentUser = auth2.currentUser.get()
                const authResponse = currentUser.getAuthResponse(true)
                const credential = firebase.auth.GoogleAuthProvider.credential(
                    authResponse.id_token,
                    authResponse.access_token
                );
                firebase.auth().signInWithCredential(credential).then(() => this.props.createAlert(Alerts.SUCCESS, "Logged In!"));
            } else {
                window.location.pathname = "/logout";
                window.location.reload();
            }
        });
    }


    render() {
        return (
            <div>
                {!this.state.gapiInitDone &&
                <div className="w3-display-middle w3-xlarge">
                    <span className="w3-center w3-padding-large">Loading</span>
                    <br/>
                    <i className="w3-center fas fa-spinner fa-spin fa-7x"/>
                </div>
                }
                {this.state.gapiInitDone &&
                this.props.children}
            </div>
        )
    }
}
