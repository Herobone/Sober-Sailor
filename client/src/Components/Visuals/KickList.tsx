import firebase from "firebase";
import React, { Component, ReactElement } from "react";
import { Alerts, Alert } from "../../helper/AlertTypes";
import { Register } from "../../helper/models/Register";

interface Props {
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
  gameID: string;
}
interface State {
  shown: boolean;
}

interface KickPlayer {
  gameID: string;
  playerID: string;
}

export class KickList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shown: false,
    };
    this.show = this.show.bind(this);
  }

  show(shown?: boolean): void {
    if (shown === undefined) {
      this.setState((prev) => {
        return { shown: !prev.shown };
      });
    } else {
      this.setState({ shown });
    }
  }

  render(): JSX.Element | null {
    if (this.state.shown) {
      const pltRaw = localStorage.getItem("playerLookupTable");
      const vals: ReactElement[] = [];
      let register: Register;
      if (pltRaw) {
        register = Register.parse(pltRaw);
        register.playerUidMap.forEach((username: string, uid: string) => {
          vals.push(
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={`kick${uid}`}
              className="w3-bar-item w3-button"
            >
              <button
                type="submit"
                onClick={() => {
                  const callData: KickPlayer = {
                    gameID: this.props.gameID,
                    playerID: uid,
                  };
                  const kickPlayer = firebase.functions().httpsCallable("kickPlayer");
                  kickPlayer(callData)
                    .then(() => this.setState({ shown: false }))
                    .catch(console.warn);
                }}
              >
                {username}
              </button>
            </li>,
          );
        });
      } else {
        this.props.createAlert(Alerts.ERROR, "LocalStorage had no PLT stored!");
      }

      return <ul className="w3-block w3-black w3-bar-block w3-border">{vals}</ul>;
    }
    return null;
  }
}
