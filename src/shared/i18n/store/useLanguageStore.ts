import { defineStore } from "pinia";
import { ref } from "vue";

import { defaultLocale, supportedLocales } from "@/shared/config/locale";
import i18n from "@/shared/i18n";

const normalizeLocale = (raw: string) => raw.toLowerCase().split("-")[0];

export const useLanguageStore = defineStore("language", () => {

  const currentLang = ref<string>(defaultLocale);

  const setLanguage = (lang: string) => {

    currentLang.value = lang;
    i18n.global.locale.value = lang;
    localStorage.setItem("lang", lang);
    document.querySelector("html")?.setAttribute("lang", lang);
  };

  const initLanguage = () => {

    const savedLang = localStorage.getItem("lang");
    if (savedLang && supportedLocales.includes(normalizeLocale(savedLang))) {
      setLanguage(savedLang);
      return;
    }

    const browserLang = normalizeLocale(window.navigator.language);
    if (supportedLocales.includes(browserLang)) {
      setLanguage(browserLang);
      return;
    }

    setLanguage(defaultLocale);
  };

  return { currentLang, setLanguage, initLanguage };
});
