<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import logoWeather from "@/assets/image/logo-weather.png";
import ThemeToggle from "@/features/theme/components/ThemeToggle.vue";
import LangSelect from "@/features/translation/components/LangSelect.vue";
import VButton from "@/shared/components/base/VButton.vue";
import { useLanguageStore } from "@/shared/i18n/store/useLanguageStore";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { RouteNames } from "@/shared/variables";

const themeStore = useThemeStore();
const languageStore = useLanguageStore();

themeStore.initTheme();
languageStore.initLanguage();
</script>

<template>
  <header class="header">
    <div class="header__container container">
      <RouterLink
        to="/"
        class="header__logo logo"
      >
        <div class="logo__wrapper">
          <img
            :src="logoWeather"
            alt="Weather logo"
          >
        </div>
        <h2 class="logo__title">
          Cloudora
        </h2>
      </RouterLink>
      <div class="header__controls">
        <ThemeToggle />
        <LangSelect />
      </div>
    </div>
  </header>
  <nav class="nav-buttons">
    <VButton
      :text="$t('nav.weather')"
      :to="{ name: RouteNames.home }"
      icon="thermometer"
      variant="nav"
    />

    <VButton
      :text="$t('nav.favorites')"
      :to="{ name: RouteNames.favorites }"
      icon="heart"
      variant="nav"
    />
  </nav>
  <main class="main">
    <div class="container main__container">
      <router-view />
    </div>
    <Toaster
      position="top-right"
      rich-colors
    />
  </main>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.header {
  position: fixed;
  width: 100%;
  padding: 10px 0;
  background: var(--header-bg-gradient);
  color: var(--header-text);
  z-index: 10;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}

.nav-buttons{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  padding-top: 90px;
  font-weight: 700;
  color: var(--header-text);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;

  &__wrapper {
    width: 40px;
    height: 40px;
  }

  &__title {
    font-size: clamp(16px, 3vw, 24px);
  }

  @media(max-width: 32rem) {
    &__title {
      display: none;
    }
  }
}

.main{
  &__container {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}

</style>
