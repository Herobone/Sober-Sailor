const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
    messagesDirectory: 'build/messages/src/extracted/',
    translationsDirectory: 'src/translations/locales/',
    languages: ["en", "de"] // Any translation --- don't include the default language
});