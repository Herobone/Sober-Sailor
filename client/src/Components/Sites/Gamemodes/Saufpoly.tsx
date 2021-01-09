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

import React, { PureComponent, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import firebase from "firebase";
import { Alert } from "../../../helper/AlertTypes";
import { GameProvider } from "../../Functional/GameProvider";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID: string;
}

export class Saufpoly extends PureComponent<Props> {
    render(): JSX.Element {
        return (
            <GameProvider>
                <div className="w3-center">
                    <FormattedMessage id="gamemodes.saufpoly" />
                    <br />
                    Game ID: {this.props.gameID}
                    <br />
                    User ID: {firebase.auth().currentUser?.uid}
                </div>
            </GameProvider>
        );
    }
}
