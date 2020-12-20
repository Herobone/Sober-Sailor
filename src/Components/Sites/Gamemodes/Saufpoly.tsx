/*****************************
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

import React, {ReactElement} from 'react';
import '../../../css/App.css';
import {Alert} from '../../../helper/AlertTypes';
import {FormattedMessage} from "react-intl";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    gameID?: string;
}

interface State {

}

class Saufpoly extends React.Component<Props, State> {

    render() {
        return (
            <div className="w3-center">
                <FormattedMessage id="gamemodes.saufpoly"/>
                {this.props.gameID}
            </div>
        );
    }

}

export default Saufpoly;
