/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactElement } from "react";
import firebase from "firebase";
import { FormattedMessage } from "react-intl";
import { Alerts, Alert } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";

interface Props {
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
  gameID?: string;
  gameURL?: string;
}

interface State {
  user: firebase.User | null;
}

export class GameProvider extends Component<Props, State> {
  nameInputRef!: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
    };

    this.createGame = this.createGame.bind(this);

    this.nameInputRef = React.createRef();
    this.setName = this.setName.bind(this);

    if (this.props.gameID) {
      localStorage.setItem("gameID", this.props.gameID);
    } else {
      localStorage.removeItem("gameID");
    }
  }

  componentDidMount(): void {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      firebase
        .auth()
        .signInAnonymously()
        .catch((error) => {
          this.props.createAlert(Alerts.ERROR, error.message);
          console.error(error.message);
        });
    } else {
      this.setState({
        user: currentUser,
      });
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user,
        });
      } else {
        console.info("Logging out");
      }
    });
  }

  setName(): void {
    const { currentUser } = firebase.auth();
    const input = this.nameInputRef.current;

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

  createGame(): void {
    if (!this.props.gameURL) {
      this.props.createAlert(Alerts.ERROR, "Fatal error! Unexpected missing Prop!");
      return;
    }
    GameManager.createGame()
      .then((gameID) => {
        window.location.pathname = `/${this.props.gameURL}/${gameID}`;
        return Promise.resolve();
      })
      .catch(console.error);
  }

  render(): JSX.Element {
    const { gameID } = this.props;
    const { user } = this.state;
    if (!gameID) {
      return (
        <div className="w3-center">
          <p className="sailor-creategame-button">
            <button type="button" onClick={this.createGame} className="w3-btn w3-round w3-orange w3-xlarge">
              <FormattedMessage id="actions.game.create" />
            </button>
          </p>
        </div>
      );
    }

    const { currentUser } = firebase.auth();

    if (!user) {
      return <div>Loading...</div>;
    }

    if (currentUser) {
      if (currentUser.displayName && currentUser.displayName !== "") {
        return (
          <div>
            {this.props.children}
            <button type="button" onClick={() => GameManager.leaveGame(gameID)}>
              <FormattedMessage id="actions.leave" />
            </button>
          </div>
        );
      }
      return (
        <div>
          <h1>
            <FormattedMessage id="account.descriptors.finishsignup" />
          </h1>
          <p>
            <label htmlFor="name-input">
              <b>
                <FormattedMessage id="account.descriptors.yourname" />
              </b>
            </label>
            <br />
            <input
              ref={this.nameInputRef}
              id="name-imput"
              className="w3-input w3-border w3-round"
              name="name"
              type="text"
              style={{ width: "40%" }}
              placeholder="Name"
            />
          </p>
          <br />
          <button type="button" className="w3-button w3-round w3-theme-d5" onClick={this.setName}>
            <FormattedMessage id="general.done" />
          </button>
        </div>
      );
    }

    return <div>Eror</div>;
  }
}
