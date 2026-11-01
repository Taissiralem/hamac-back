// Champ bilingue réutilisable : { fr, en }
const i18nField = (required = false) => ({
  fr: { type: String, default: "", required },
  en: { type: String, default: "" },
});

module.exports = i18nField;
