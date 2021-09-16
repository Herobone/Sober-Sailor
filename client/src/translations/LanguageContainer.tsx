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
import Util from "@herobone/sobersailor-common/lib/Util";
import { useLanguage } from "../state/actions/languageActions";

const messageLoader = {
    en: () => import("./locales/en.json"),
    de: () => import("./locales/de.json"),
    // de_AT: () => import("./locales/de_AT.json"),
};

export function LanguageContainer(props: React.PropsWithChildren<unknown>): JSX.Element {
    const cookies: Cookies = new Cookies();
    const [intermediateMsg, setIntermediateMsg] = useState({});
    const [msg, setMsg] = useState<{ [key: string]: string }>();
    const [currentLanguage, setCurrentLanguage] = useState<string>();
    const [language, setGlobalLanguage] = useLanguage();

    useEffect(() => {
        // Get language selection from cookie
        let lang: string | undefined = cookies.get("locale");

        // If the language was not available, get it from the browser navigator
        if (!lang) {
            [lang] = navigator.language.split("-");
        }

        // If the language that was selected does not exist in Translations, use english
        if (!Util.hasKey(messageLoader, lang)) {
            lang = "en";
        }

        setGlobalLanguage(lang);
    }, []);

    // If language changed
    useEffect(() => {
        // Update cookie
        cookies.set("locale", language, { expires: Util.getDateIn(10), sameSite: true });

        // Set messages if the selected language exists
        if (Util.hasKey(messageLoader, language)) {
            messageLoader[language]()
                .then((messages: { default: { [key: string]: string } }) => {
                    setIntermediateMsg(messages);
                    return setCurrentLanguage(language);
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }
    }, [language]);

    useEffect(() => {
        if (currentLanguage === language) {
            setMsg(intermediateMsg);
        }
    }, [currentLanguage]);

    return (
        <>
            {msg && currentLanguage && (
                <IntlProvider locale={language} messages={msg}>
                    {props.children}
                </IntlProvider>
            )}
        </>
    );
}
