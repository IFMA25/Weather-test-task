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
  activeClass = "btn--nav-active",
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
  padding: 0;

  &--main {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    background-color: #1a1413;
    color: #fff;
    font-weight: 500;

    &:hover:not(.btn--disabled) {
      background-color: lighten(#1a1413, 12%);
    }

    &:active:not(.btn--disabled) {
      background-color: darken(#1a1413, 4%);
    }
  }

  &--icon {
    padding: 0.5rem;
    border-radius: 50%;

    &:hover:not(.btn--disabled) {
      background-color: rgba(#1a1413, 0.08);
    }

    &:active:not(.btn--disabled) {
      background-color: rgba(#1a1413, 0.16);
    }
  }

  &--nav-active {
    font-weight: 600;
    color: #1a1413;
  }

  &--disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.5;
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
