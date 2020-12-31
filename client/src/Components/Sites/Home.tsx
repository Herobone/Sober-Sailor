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
import "../../css/App.css";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Alert } from "../../helper/AlertTypes";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {}

export class Home extends PureComponent<Props, State> {
    render(): JSX.Element {
        return (
            <div className="w3-center">
                <div className="w3-card-4 sailor-startpage-gameselector">
                    <header className="w3-container w3-yellow">
                        <h1>
                            <FormattedMessage id="sobersailor.name" />
                        </h1>
                    </header>

                    <div className="w3-container">
                        <p className="sailor-gameselect-button">
                            <Link to="mixed" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.mixed" />
                            </Link>
                        </p>
                        <p className="sailor-gameselect-button">
                            <Link to="/truthordare" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.truthordare" />
                            </Link>
                        </p>
                        <p className="sailor-gameselect-button">
                            <Link to="/saufpoly" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.saufpoly" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
