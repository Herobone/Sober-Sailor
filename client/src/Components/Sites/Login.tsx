import React, { Component, ReactElement } from "react";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import { Redirect } from "react-router";
import { FormattedMessage } from "react-intl";
import { Alerts, Alert } from "../../helper/AlertTypes";

interface Props {
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
  isSignedIn: boolean;
}

export class Login extends Component<Props, State> {
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
        this.props.createAlert(Alerts.ERROR, error.message);
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
