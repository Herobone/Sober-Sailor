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

import firebase from "firebase";
import React, { Component, ReactElement } from "react";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { Register } from "../../helper/models/Register";
import { AlertContext } from "../Functional/AlertProvider";

interface Props {}
interface State {
    shown: boolean;
}

interface KickPlayer {
    gameID: string;
    playerID: string;
}

export class KickList extends Component<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

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
                                        gameID: GameManager.getGameID(),
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
                this.context.createAlert(Alerts.ERROR, "LocalStorage had no PLT stored!");
            }

            return <ul className="w3-block w3-black w3-bar-block w3-border">{vals}</ul>;
        }
        return null;
    }
}
