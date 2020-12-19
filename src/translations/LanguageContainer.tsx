
import * as React from 'react';
import messages_en from './locales/en.json';
import messages_de from './locales/de.json';
import { IntlProvider } from 'react-intl';
import Cookies from 'universal-cookie';
import Util from "../helper/Util";

interface State {
    locale: string
}

const MESSAGES = {
    'en': messages_en,
    'de': messages_de
};

interface Props {
}

class LanguageContainer extends React.Component<Props, State> {

    cookies: Cookies;

    constructor(props: Props) {
        super(props);

        this.cookies = new Cookies();
        
        let lang = this.cookies.get("locale");
        if (!lang || typeof lang === "undefined") {
            lang = navigator.language.split("-")[0];
        }
        if (!Util.hasKey(MESSAGES, lang)) {
            lang = "de";
        }
        this.state = {
            locale: lang
        }
        this.changeLanguage = this.changeLanguage.bind(this);
        this.getCurrentLocale = this.getCurrentLocale.bind(this);
    }

    public changeLanguage(locale: string) {
        this.cookies.set("locale", locale, { expires: new Date(9999, 12) })
        this.setState({
            locale
        });
    }

    public getCurrentLocale(): string {
        return this.state.locale;
    }

    public render() {
        const { locale } = this.state;
        let msg = {};
        if (Util.hasKey(MESSAGES, locale)) {
            msg = MESSAGES[locale];
        }

        return (
            <IntlProvider locale={locale} messages={msg}>
                {this.props.children}
            </IntlProvider>
        );
    }
}

export default LanguageContainer;