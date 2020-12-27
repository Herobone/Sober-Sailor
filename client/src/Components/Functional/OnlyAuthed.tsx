import React, { Component } from "react";
import firebase from "firebase";
import { Redirect } from "react-router";

interface Props {
  className?: string;
}

export default class OnlyAuthed extends Component<Props> {
  render() {
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
