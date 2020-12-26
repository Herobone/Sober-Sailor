import firebase from 'firebase';
import { Component, ReactElement } from 'react'
import Alerts, { Alert } from '../../helper/AlertTypes';
import { Register } from '../../helper/models/Register';

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

export default class KickList extends Component<Props, State> {
    state = {
        shown: false,
    }

    constructor(props: Props) {
        super(props);
        this.show = this.show.bind(this);
    }

    show(shown?: boolean) {
        if (shown === undefined) {
            this.setState({ shown: !this.state.shown });
        } else {
            this.setState({ shown });
        }
    }

    render() {
        if (this.state.shown) {
            const pltRaw = localStorage.getItem("playerLookupTable");
            let vals: ReactElement[] = [];
            let register: Register;
            if (pltRaw) {
                register = Register.parse(pltRaw);
                register.playerUidMap.forEach((username: string, uid: string) => {
                    vals.push(<li key={"kick" + uid} onClick={() => {
                        const callData: KickPlayer = { gameID: this.props.gameID, playerID: uid };
                        const kickPlayer = firebase.functions().httpsCallable("kickPlayer");
                        kickPlayer(callData).then(() => {
                            this.setState({ shown: false });
                        }).catch(console.warn);
                    }} className="w3-bar-item w3-button">{username}</li>)
                })
            } else {
                this.props.createAlert(Alerts.ERROR, "LocalStorage had no PLT stored!");
            }

            return (
                <ul
                    className="w3-block w3-black w3-bar-block w3-border"
                >
                    {vals}
                </ul>
            );
        } else {
            return null;
        }
    }
}
