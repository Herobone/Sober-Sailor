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
import { FormattedMessage } from "react-intl";
import { Collapse } from "@material-ui/core";
import { Alert as IAlert } from "../../helper/AlertTypes";

interface Props {
    header?: ReactElement;
    type: IAlert;
    clear: () => void;
}

interface State {
    shown: boolean;
}

export class Alert extends Component<Props, State> {
    timeout?: NodeJS.Timeout;

    selfDestroy?: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        this.state = {
            shown: false,
        };
    }

    componentDidMount(): void {
        this.selfDestroy = setTimeout(this.close, 10000);
        this.setState({ shown: true });
    }

    componentWillUnmount(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.selfDestroy) {
            clearTimeout(this.selfDestroy);
        }
    }

    close = (): void => {
        this.setState({ shown: false });
        this.timeout = setTimeout(() => this.props.clear(), 550);
    };

    render(): JSX.Element {
        return (
            <Collapse in={this.state.shown} timeout={500}>
                <div className={`w3-panel ${this.props.type.color} w3-display-container`}>
                    <button onClick={this.close} type="button" className="w3-button w3-large w3-display-topright">
                        &times;
                    </button>
                    <h3>
                        {this.props.header && this.props.header}
                        {!this.props.header && <FormattedMessage id={this.props.type.defaultHeader} />}
                    </h3>
                    <p>{this.props.children}</p>
                </div>
            </Collapse>
        );
    }
}
