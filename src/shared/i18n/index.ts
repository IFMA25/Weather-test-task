import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import uk from "./locales/uk.json";
import { defaultLocale } from "../config/locale";

export default createI18n({
  locale: defaultLocale,
  legacy: false,
  globalInjection: true,
  messages: { en, uk },
});
