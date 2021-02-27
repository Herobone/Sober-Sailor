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

import React from "react";
import { FormattedMessage } from "react-intl";
import FormControl from "@material-ui/core/FormControl";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { Column } from "../Visuals/Column";
import { useLanguageContext } from "../../translations/LanguageContainer";
import { useDefaultStyles } from "../../css/Style";

type Language = { code: string; name: string };

export function Settings(): JSX.Element {
    const { currentLocale, changeLanguage } = useLanguageContext();
    const classes = useDefaultStyles();
    const options: Language[] = [
        { code: "de", name: "Deutsch" },
        { code: "en", name: "English" },
    ];

    return (
        <Column additionalClasses="app-content">
            <h1>
                <FormattedMessage id="account.navigation.settings" />
            </h1>
            <hr />
            <br />
            <FormControl variant="outlined" className={classes.langSelect}>
                <InputLabel htmlFor="outlined-age-native-simple">
                    <FormattedMessage id="settings.labels.selectlanguage" />
                </InputLabel>
                <br />
                <Select
                    value={currentLocale}
                    label={<FormattedMessage id="settings.labels.selectlanguage" />}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        const val = event.target.value as string;
                        changeLanguage(val);
                    }}
                >
                    {options.map((value: Language) => {
                        return <MenuItem value={value.code}>{value.name}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </Column>
    );
}
