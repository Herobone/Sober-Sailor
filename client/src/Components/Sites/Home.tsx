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
import { Link } from "react-router-dom";
import App from "../../css/App.module.scss";
import { AlertCreator, Alerts } from "../../helper/AlertTypes";
import { Util } from "../../helper/Util";

interface Props {
    createAlert: AlertCreator;
}

interface State {}

export class Home extends PureComponent<Props, State> {
    render(): JSX.Element {
        return (
            <>
                <div className={App.sailorStartpageGameselector}>
                    <header className="w3-container w3-yellow">
                        <h1>
                            <FormattedMessage id="sobersailor.name" />
                        </h1>
                    </header>

                    <div className="w3-container">
                        <p className={App.sailorGameselectButton}>
                            <Link to="mixed" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.mixed" />
                            </Link>
                        </p>
                        <p className={App.sailorGameselectButton}>
                            <Link to="/truthordare" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.truthordare" />
                            </Link>
                        </p>
                        <p className={App.sailorGameselectButton}>
                            <Link to="/saufpoly" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.saufpoly" />
                            </Link>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            this.props.createAlert(Alerts.INFO, Util.randomCharOrNumberSequence(5));
                        }}
                    >
                        Test Alert
                    </button>
                </div>
            </>
        );
    }
}
