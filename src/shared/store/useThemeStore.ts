import { defineStore } from "pinia";
import { computed, ref } from "vue";

type Theme = "light" | "dark";

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<Theme>("light");

  const isDark = computed(() => currentTheme.value === "dark");
  const isLight = computed(() => currentTheme.value === "light");

  const updateDocumentTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    updateDocumentTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === "light" ? "dark" : "light");
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme: Theme = savedTheme ?? (prefersDark ? "dark" : "light");
    currentTheme.value = theme;
    updateDocumentTheme(theme);
  };

  return {
    currentTheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    initTheme,
  };
});
