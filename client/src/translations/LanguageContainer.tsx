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

import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import messages_en from "./locales/en.json";
import messages_de from "./locales/de.json";
import messages_de_AT from "./locales/de_AT.json";
import { Util } from "../helper/Util";
import { RootState } from "../state/store";
import { LanguageState } from "../state/reducers/languageReducer";
import { setLanguage } from "../state/actions/languageActions";

const MESSAGES = {
    en: messages_en,
    de: messages_de,
    de_AT: messages_de_AT,
};

export function LanguageContainer(props: React.PropsWithChildren<unknown>): JSX.Element {
    const cookies: Cookies = new Cookies();
    const language = useSelector<RootState, LanguageState["language"]>((state) => state.language.language);
    const [msg, setMsg] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        // Get language selection from cookie
        let lang: string | undefined = cookies.get("locale");

        // If the language was not available, get it from the browser navigator
        if (!lang) {
            [lang] = navigator.language.split("-");
        }

        // If the language that was selected does not exist in Translations, use english
        if (!Util.hasKey(MESSAGES, lang)) {
            lang = "en";
        }

        // Dispatch language
        dispatch(setLanguage(lang));
    }, []);

    // If language changed
    useEffect(() => {
        // Update cookie
        cookies.set("locale", language, { expires: Util.getDateIn(10), sameSite: true });

        // Set messages if the selected language exists
        if (Util.hasKey(MESSAGES, language)) {
            setMsg(MESSAGES[language]);
        }
    }, [language]);

    return (
        <IntlProvider locale={language} messages={msg}>
            {props.children}
        </IntlProvider>
    );
}
