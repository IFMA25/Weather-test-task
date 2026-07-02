<script setup lang="ts">
import { computed } from "vue";

const {
  width,
  height,
  variant = "base",
  rounded = "lg",
} = defineProps<{
  width: string;
  height: string;
  variant?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  count?: number;
}>();

const computedClasses = computed(() => [
  "v-skeleton",
  `v-skeleton--rounded-${rounded}`,
  `v-skeleton--variant-${variant}`,
]);

const computedStyles = computed(() => ({
  width,
  height,
}));
</script>

<template>
  <div
    :class="computedClasses"
    :style="computedStyles"
  />
</template>

<style lang="scss" scoped>
.v-skeleton {
  position: relative;
  overflow: hidden;

  &--rounded {
    &-none { border-radius: 0; }
    &-sm { border-radius: 0.125rem; }
    &-md { border-radius: 0.375rem; }
    &-lg { border-radius: 0.5rem; }
    &-full { border-radius: 9999px; }
  }

  &--variant {
    &-base {
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: shimmer-pulse 1.5s infinite linear;
    }
  }
}

@keyframes shimmer-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
