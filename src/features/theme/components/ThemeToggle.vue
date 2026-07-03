<script setup lang="ts">
import { computed } from "vue";
import VueFeather from "vue-feather";

import VSwitch from "@/shared/components/base/VSwitch.vue";
import { useThemeStore } from "@/shared/store/useThemeStore";

const themeStore = useThemeStore();

const themeValue = computed({
  get: () => themeStore.isDark,
  set: (value: boolean) => themeStore.setTheme(value ? "dark" : "light"),
});
</script>

<template>
  <VSwitch
    v-model="themeValue"
    class="theme-toggle"
    variant="theme"
    aria-label="Toggle theme"
  >
    <template #track-content>
      <div class="theme-toggle__track-icons">
        <VueFeather
          type="sun"
          size="14"
          class="theme-toggle__track-icon theme-toggle__track-icon--sun"
        />
        <VueFeather
          type="moon"
          size="14"
          class="theme-toggle__track-icon theme-toggle__track-icon--moon"
        />
      </div>
    </template>

    <template #thumb-icon>
      <div class="theme-toggle__thumb-content">
        <VueFeather
          type="sun"
          size="14"
          class="theme-toggle__thumb-icon theme-toggle__thumb-icon--sun"
          :class="{ 'theme-toggle__thumb-icon--active': !themeValue }"
        />
        <VueFeather
          type="moon"
          size="14"
          class="theme-toggle__thumb-icon theme-toggle__thumb-icon--moon"
          :class="{ 'theme-toggle__thumb-icon--active': themeValue }"
        />
      </div>
    </template>
  </VSwitch>
</template>

<style scoped lang="scss">
.theme-toggle {
  &__track-icons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 0.625rem;
  }

  &__track-icon {
    flex-shrink: 0;
    opacity: 0.9;

    &--sun {
      color: var(--button-bg);
    }

    &--moon {
      color: var(--color-primary);
    }
  }

  &__thumb-content {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    position: relative;
  }

  &__thumb-icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0.875rem;
    height: 0.875rem;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &--sun {
      color: var(--button-text);
      transform: scale(0.55) rotate(90deg);
    }

    &--moon {
      transform: scale(0.55) rotate(-90deg);
    }

    &--active {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
}
</style>
