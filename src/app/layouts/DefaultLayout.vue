<script setup lang="ts">
import VueFeather from "vue-feather";
import { Toaster } from "vue-sonner";

import LangSwitcher from "@/features/translation/components/LangSwitcher.vue";
import VButton from "@/shared/ui/base/VButton.vue";
import { RouteNames } from "@/shared/variables";
import "vue-sonner/style.css";
</script>

<template>
  <div>
    <header>
      <VueFeather type="sunrise" />
      <h1>Weather</h1>

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
      <LangSwitcher />
    </header>
    <main>
      <router-view />
      <Toaster />
    </main>
  </div>
</template>
