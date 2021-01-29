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
import { IntlProvider } from "react-intl";
import Cookies from "universal-cookie";
import messages_en from "./locales/en.json";
import messages_de from "./locales/de.json";
import messages_de_AT from "./locales/de_AT.json";
import { Util } from "../helper/Util";

interface State {
    locale: string;
}

const MESSAGES = {
    en: messages_en,
    de: messages_de,
    de_AT: messages_de_AT,
};

interface Props {}

type LanguageContextType = {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
};

export const LanguageContext = React.createContext<LanguageContextType>({
    currentLocale: "en",
    changeLanguage: () => {
        console.error("Tried to change Language on unmounted LanguageContainer!");
    },
});
LanguageContext.displayName = "LanguageContext";

export const useLanguageContext = (): LanguageContextType => React.useContext(LanguageContext);

export class LanguageContainer extends React.Component<Props, State> {
    cookies: Cookies;

    constructor(props: Props) {
        super(props);

        this.cookies = new Cookies();

        let lang: string | undefined = this.cookies.get("locale");
        if (!lang) {
            [lang] = navigator.language.split("-");
        }
        if (!Util.hasKey(MESSAGES, lang)) {
            lang = "de";
        }
        this.state = {
            locale: lang,
        };
    }

    changeLanguage = (locale: string): void => {
        this.cookies.set("locale", locale, { expires: new Date(9999, 12) });
        this.setState({
            locale,
        });
    };

    public render(): JSX.Element {
        const { locale } = this.state;
        let msg = {};
        if (Util.hasKey(MESSAGES, locale)) {
            msg = MESSAGES[locale];
        }

        return (
            <IntlProvider locale={locale} messages={msg}>
                <LanguageContext.Provider
                    value={{
                        changeLanguage: this.changeLanguage,
                        currentLocale: this.state.locale,
                    }}
                >
                    {this.props.children}
                </LanguageContext.Provider>
            </IntlProvider>
        );
    }
}
