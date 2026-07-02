import axios from "axios";

import { useLanguageStore } from "../i18n/store/useLanguageStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const lang = useLanguageStore().currentLang;

  config.params = {
    ...config.params,
    appid: import.meta.env.VITE_API_KEY,
    units: "metric",
    lang: lang,
  };

  return config;
});
