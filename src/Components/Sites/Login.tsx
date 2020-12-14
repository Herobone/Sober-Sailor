import React, { Component, ReactElement } from 'react'
import firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { Redirect } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Alerts, {Alert} from "../../helper/AlertTypes";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
    isSignedIn: boolean;
}

export class Login extends Component<Props, State> {

    nameInputRef!: React.RefObject<HTMLInputElement>;
    unregisterAuthObserver!: firebase.Unsubscribe;

    state = {
        isSignedIn: false
    }

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'redirect',
        // We will display Google, Email and GitHub as auth providers.
        signInOptions: [
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
                return false;
            },
            signInFailure: (error: firebaseui.auth.AuthUIError) => {
                this.props.createAlert(Alerts.ERROR, error.message);
                console.warn(error.message);
                return new Promise<void>((resolve) => {
                    resolve();
                })
            }
        }
    };

    constructor(props: Props) {
        super(props);
        this.nameInputRef = React.createRef();
        this.setName = this.setName.bind(this);
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => {
                this.setState({ isSignedIn: !!user });
            }
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    setName() {
        const currentUser = firebase.auth().currentUser,
            input = this.nameInputRef.current;

        if (!input || !currentUser) {
            this.props.createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            return;
        }

        if (input.value.length < 3) {
            this.props.createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname" />);
            return;
        }

        currentUser.updateProfile({ displayName: input.value });
        this.forceUpdate();
    }

    render() {
        const currentUser = firebase.auth().currentUser;
        return (
            <div className="login-page">
                {
                    !currentUser &&
                    <div>
                        <h1 className="w3-center">
                            <FormattedMessage id="general.welcome" />!
                    <br />
                        </h1>
                        <h3 className="w3-center">
                            <FormattedMessage id="account.descriptors.signinneeded" />
                        </h3>
                        <div className="w3-center">
                            <button
                                className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button"
                                onClick={() => gapi.auth2.getAuthInstance().signIn()}>
                                <span className="firebaseui-idp-icon-wrapper">
                                    <img className="firebaseui-idp-icon" alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
                                </span>
                                <div className="firebaseui-idp-text firebaseui-idp-text-long">
                                    <FormattedMessage id="account.actions.login.withGoogle" />
                                </div>
                            </button>
                        </div>
                        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                    </div>
                }
                {
                    currentUser &&
                    <div>
                        {
                            (currentUser.displayName === null ||
                                currentUser.displayName.length <= 0) &&
                            <div>
                                <h1>
                                    <FormattedMessage id="account.descriptors.finishsignup" />
                                </h1>
                                <p>
                                    <label><b><FormattedMessage id="account.descriptors.yourname" /></b></label>
                                    <br />
                                    <input
                                        ref={this.nameInputRef}
                                        className="w3-input w3-border w3-round"
                                        name="name"
                                        type="text"
                                        style={{ width: "40%" }}
                                        placeholder="Name"
                                    />
                                </p>
                                <br />
                                <button className="w3-button w3-round w3-theme-d5" onClick={this.setName}>
                                    <FormattedMessage id="general.done" />
                                </button>
                            </div>
                        }
                        {
                            currentUser.displayName !== null &&
                            currentUser.displayName.length > 0 &&
                            <Redirect to="/" />
                        }
                    </div>
                }
            </div >
        )
    }
}

export default Login;
