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

import React, { PureComponent } from "react";
import { FormattedMessage } from "react-intl";
import { Dropdown } from "../Visuals/Dropdown";
import { Column } from "../Visuals/Column";
import { Util } from "../../helper/Util";

interface Props {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
}

export class Settings extends PureComponent<Props> {
    render(): JSX.Element {
        const options = {
            de: "Deutsch",
            en: "English",
            de_AT: "Boarisch",
        };

        return (
            <Column additionalClasses="app-content">
                <h1>
                    <FormattedMessage id="account.navigation.settings" />
                </h1>
                <hr />
                <h5>
                    <FormattedMessage id="settings.labels.selectlanguage" />
                </h5>
                <Dropdown
                    callback={this.props.changeLanguage}
                    content={Util.objToStrMap(options)}
                    selected={this.props.currentLocale}
                />
                <hr />
            </Column>
        );
    }
}
