<script setup lang="ts">
import { computed } from "vue";
import VueFeather from "vue-feather";
import { type RouteLocationRaw, RouterLink, useLink } from "vue-router";

import VLoader from "./VLoader.vue";

const {
  text = "",
  loading = false,
  type = "button",
  variant = "",
  disabled = false,
  to = null,
  icon = "",
  activeClass = "btn--active",
} = defineProps<{
  text?: string;
  loading?: boolean;
  type?: string;
  variant?: string;
  disabled?: boolean;
  to?: RouteLocationRaw | null;
  icon?: string;
  activeClass?: string;
}>();

const { isActive } = (to && to !== "")
  ? useLink({ to })
  : { isActive: computed(() => false) };

const isDisabled = computed(() => disabled || loading);

const isRouterLink = computed(() => !!to);

const btnClasses = computed(() => [
  "btn",
  variant ? `btn--${variant}` : "",
  isDisabled.value ? "btn--disabled" : "",
  isActive.value && activeClass ? activeClass : "",
]);
</script>

<template>
  <component
    :is="isRouterLink ? RouterLink : 'button'"
    :to="isRouterLink ? to : undefined"
    :type="!isRouterLink ? type : undefined"
    :disabled="!isRouterLink ? isDisabled : undefined"
    :aria-disabled="String(isDisabled)"
    :class="btnClasses"
  >
    <span
      v-if="icon || loading"
      class="btn__icon"
    >
      <VLoader
        v-if="loading && !$slots['icon-start'] && !icon"
      />
      <slot
        v-else-if="$slots['icon-start']"
        name="icon-start"
      />
      <VueFeather
        v-else
        :type="icon"
      />
    </span>

    <span
      v-if="text"
      class="btn__text"
    >
      {{ text }}
    </span>

    <span
      v-if="$slots['icon-end']"
      class="btn__icon"
    >
      <slot name="icon-end" />
    </span>
  </component>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/variables.scss" as *;
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--button-bg);
  color: var(--button-text);
  &--main {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 500;
  }
  &:hover {
      background-color: var(--button-bg-hover);
    }
  &--nav{
    background-color: transparent;
    color: var(--color-text-header);
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
    border-radius: 0;

    &:hover {
      background-color: transparent;
      border-bottom: 1px solid var(--button-bg);
    }

    @media(max-width: $sm) {
      padding: 0.3rem 0.5rem;
    }
  }

  &--icon {
    padding: 0.5rem;
    border-radius: 50%;
  }

  &--active {
    color: var(--button-active);
  }

  &--disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.5;
  }

  &--danger{
    background-color: var(--color-error);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  &__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: opacity 0.3s ease;
  }
}
</style>
