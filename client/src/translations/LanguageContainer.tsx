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

export class LanguageContainer extends React.Component<Props, State> {
  cookies: Cookies;

  constructor(props: Props) {
    super(props);

    this.cookies = new Cookies();

    let lang: string | undefined = this.cookies.get("locale");
    if (!lang || lang === undefined) {
      [lang] = navigator.language.split("-");
    }
    if (!Util.hasKey(MESSAGES, lang)) {
      lang = "de";
    }
    this.state = {
      locale: lang,
    };
    this.changeLanguage = this.changeLanguage.bind(this);
    this.getCurrentLocale = this.getCurrentLocale.bind(this);
  }

  public getCurrentLocale(): string {
    return this.state.locale;
  }

  public changeLanguage(locale: string): void {
    this.cookies.set("locale", locale, { expires: new Date(9999, 12) });
    this.setState({
      locale,
    });
  }

  public render(): JSX.Element {
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
