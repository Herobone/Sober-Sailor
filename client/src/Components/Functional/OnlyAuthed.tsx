import React, { PureComponent } from "react";
import firebase from "firebase";
import { Redirect } from "react-router";

interface Props {
  className?: string;
}

export class OnlyAuthed extends PureComponent<Props> {
  render(): JSX.Element {
    const { currentUser } = firebase.auth();

    return (
      <div>
        {currentUser && (
          <div className="only-authed">
            <div className={this.props.className}>{this.props.children}</div>
          </div>
        )}
        {!currentUser && <Redirect to="/login" />}
      </div>
    );
  }
}
