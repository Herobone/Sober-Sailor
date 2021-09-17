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
import FormControl from "@mui/material/FormControl";
import { Container, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useDefaultStyles } from "../../css/Style";
import { setLanguage } from "../../state/actions/languageActions";
import { RootState } from "../../state/store";
import { LanguageState } from "../../state/reducers/languageReducer";

type Language = { code: string; name: string };

export function Settings(): JSX.Element {
    const classes = useDefaultStyles();
    const dispatch = useDispatch();

    const language = useSelector<RootState, LanguageState["language"]>((state) => state.language.language);
    const options: Language[] = [
        { code: "de", name: "Deutsch" },
        { code: "en", name: "English" },
    ];

    return (
        <Container>
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
                    value={language}
                    label={<FormattedMessage id="settings.labels.selectlanguage" />}
                    onChange={(event: SelectChangeEvent) => {
                        const val = event.target.value;
                        dispatch(setLanguage(val));
                    }}
                >
                    {options.map((value: Language) => (
                        <MenuItem value={value.code} key={`lang_${value.code}_option`}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
}
