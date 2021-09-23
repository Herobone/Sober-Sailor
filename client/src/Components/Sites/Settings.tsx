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
import FormControl from "@mui/material/FormControl";
import { Container, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import Util from "sobersailor-common/lib/Util";
import Cookies from "universal-cookie";
import { useDefaultStyles } from "../../style/Style";
import { useLanguage, useThemeSetting } from "../../state/actions/settingActions";
import { AvailableThemes } from "../../style/Theme";
import { useDefaultTranslation } from "../../translations/DefaultTranslationProvider";
import { TranslatedMessage } from "../../translations/TranslatedMessage";

type LanguageSetting = { code: string; name: string };
type ThemeSetting = { code: AvailableThemes; name: string };

export function Settings(): JSX.Element {
    const classes = useDefaultStyles();
    const cookies: Cookies = new Cookies();
    const intl = useDefaultTranslation();
    const [language, setLanguage] = useLanguage();
    const [theme, setTheme] = useThemeSetting();
    const options: LanguageSetting[] = [
        { code: "de", name: "Deutsch" },
        { code: "en", name: "English" },
        { code: "no", name: "Norwegian Bokmål" },
        { code: "fr", name: "French" },
        { code: "it", name: "Italian" },
    ];

    const themeOptions: ThemeSetting[] = [
        { code: "light", name: intl.formatMessage({ id: "settings.options.theme.light" }) },
        { code: "calm", name: intl.formatMessage({ id: "settings.options.theme.calm" }) },
        { code: "dark", name: intl.formatMessage({ id: "settings.options.theme.dark" }) },
    ];

    return (
        <Container>
            <h1>
                <TranslatedMessage id="account.navigation.settings" />
            </h1>
            <hr />
            <br />
            <FormControl variant="outlined" className={classes.langSelect}>
                <InputLabel htmlFor="outlined-age-native-simple">
                    <TranslatedMessage id="settings.labels.selectlanguage" />
                </InputLabel>
                <br />
                <Select
                    value={language}
                    label={<TranslatedMessage id="settings.labels.selectlanguage" />}
                    onChange={(event: SelectChangeEvent) => {
                        const val = event.target.value;
                        setLanguage(val);
                    }}
                >
                    {options.map((value: LanguageSetting) => (
                        <MenuItem value={value.code} key={`lang_${value.code}_option`}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <br />
            <FormControl variant="outlined" className={classes.langSelect}>
                <InputLabel htmlFor="outlined-age-native-simple">
                    <TranslatedMessage id="settings.labels.selecttheme" />
                </InputLabel>
                <br />
                <Select
                    value={theme}
                    label={<TranslatedMessage id="settings.labels.selecttheme" />}
                    onChange={(event: SelectChangeEvent) => {
                        const val = event.target.value as AvailableThemes;
                        setTheme(val);
                        cookies.set("theme", val, { expires: Util.getDateIn(10), sameSite: true });
                    }}
                >
                    {themeOptions.map((value: ThemeSetting) => (
                        <MenuItem value={value.code} key={`theme_${value.code}_option`}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
}
