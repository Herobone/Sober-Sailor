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

import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import Cookies from 'universal-cookie';
import { Register } from "../../helper/models/Register";

interface Props {
    question: string;
    target: string;
}

interface State {
}

export default class TruthOrDare extends Component<Props, State> {
    state = {
    }

    componentDidMount() {
    }

    render() {
        const cookie = new Cookies();
        const register = Register.deserialize(cookie.get("playerLookupTable"));
        const targetName = register.playerUidMap.get(this.props.target);
        return (
            <div>
                <h2>{targetName}:</h2>
                <h2><FormattedMessage id={"gamemodes.truthordare"} /></h2>
                {this.props.question}
            </div>
        )
    }
}