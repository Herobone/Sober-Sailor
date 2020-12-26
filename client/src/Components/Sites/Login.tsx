import {Component, ReactElement} from 'react'
import firebase from 'firebase';
import {StyledFirebaseAuth} from 'react-firebaseui';
import {Redirect} from 'react-router';
import {FormattedMessage} from 'react-intl';
import Alerts, {Alert} from "../../helper/AlertTypes";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
    isSignedIn: boolean;
}

export class Login extends Component<Props, State> {

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
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
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

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => {
                this.setState({isSignedIn: !!user});
            }
        );
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            if (currentUser.isAnonymous) {
                firebase.auth().signOut().then(() => this.forceUpdate());
                console.log("Logged out of anonymous");
            }
        }
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        const currentUser = firebase.auth().currentUser;
        return (
            <div className="login-page">
                {
                    //!currentUser &&
                    <div>
                        <h1 className="w3-center">
                            <FormattedMessage id="general.welcome"/>!
                            <br/>
                        </h1>
                        <h3 className="w3-center">
                            <FormattedMessage id="account.descriptors.signinneeded"/>
                        </h3>
                        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                    </div>
                }
                {
                    currentUser &&
                    <div>
                        {!currentUser.isAnonymous &&
                        <Redirect to="/"/>
                        }
                        Lol
                    </div>
                }
            </div>
        )
    }
}

export default Login;
