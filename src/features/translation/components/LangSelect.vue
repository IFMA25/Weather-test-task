<script setup lang="ts">
import { computed } from "vue";

import VSelect from "@/shared/components/base/VSelect.vue";
import { supportedLocales } from "@/shared/config/locale";
import {
  useLanguageStore,
} from "@/shared/i18n/store/useLanguageStore";

const localeLabels: Record<string, string> = {
  en: "EN",
  uk: "UA",
};

const language = useLanguageStore();

const localeOptions = computed(
  () => supportedLocales.map((locale: string) => ({
    key: locale,
    label: localeLabels[locale],
  })),
);

</script>

<template>
  <VSelect
    id="language-switcher"
    v-model="language.currentLang"
    :options="localeOptions"
    label="label"
    track-by="key"
    :close-on-select="true"
    size="sm"
    @update:model-value="(value: string) => language.setLanguage(value)"
  />
</template>
