<script setup lang="ts">
import { Toaster } from "vue-sonner";

import logoWeather from "@/assets/image/logo-weather.png";
import LangSelect from "@/features/translation/components/LangSelect.vue";
import VButton from "@/shared/ui/base/VButton.vue";
import { RouteNames } from "@/shared/variables";
import "vue-sonner/style.css";
</script>

<template>
  <header class="header">
    <div class="header-container container">
      <div class="header-logo logo">
        <div class="logo__wrapper">
          <img
            :src="logoWeather"
            alt="Weather logo"
          >
        </div>
        <h2 class="logo__title">
          Cloudora
        </h2>
      </div>
      <nav class="header-nav">
        <VButton
          :text="$t('nav.weather')"
          :to="{ name: RouteNames.home }"
          icon="thermometer"
        />

        <VButton
          :text="$t('nav.favorites')"
          :to="{ name: RouteNames.favorites }"
          icon="heart"
        />
      </nav>
      <LangSelect />
    </div>
  </header>
  <main>
    <router-view />
    <Toaster />
  </main>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background: linear-gradient(to right, #a9dcff 0%, #fff2b8 100%);
  &-nav {
    display: flex;
    align-items: center;
    gap: 25px;
  }
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;

  &__wrapper {
    width: 40px;
    height: 40px;
  }
}

.logo img {
  width: 100%;
  height: 100%;
}

</style>
