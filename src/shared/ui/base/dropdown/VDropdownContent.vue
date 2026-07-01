<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { calculatePosition } from "@/shared/utils/calculatePosition";

const emit = defineEmits<{
  close: [];
}>();

const dropdownEl = ref<HTMLElement | null>(null);
const dropdownWidth = ref(0);
const dropdownHeight = ref(0);

const { isOpen, rect } = defineProps<{
  isOpen: boolean;
  rect: DOMRect | null;
}>();

const positionStyle = computed(() => {
  if (!rect || !dropdownWidth.value || !dropdownHeight.value) return {};

  const { top, left } = calculatePosition({
    rect,
    dropdownWidth: dropdownWidth.value,
    dropdownHeight: dropdownHeight.value,
    margin: 8,
  });

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

watch(
  () => dropdownEl.value,
  (el) => {
    if (!el || !isOpen || !rect) return;

    requestAnimationFrame(() => {
      const box = el.getBoundingClientRect();
      dropdownWidth.value = box.width;
      dropdownHeight.value = box.height;
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="isOpen && rect"
        ref="dropdownEl"
        class="dropdown-content"
        :style="positionStyle"
        v-bind="$attrs"
        @click="emit('close')"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/variables.scss" as *;
.dropdown-content {
  position: fixed;
  white-space: nowrap;
  min-width: 2.5rem;
  border: 1px solid $primary;
  background-color: $primary;
  box-shadow: 0 0 10px $primary;
  border-radius: $radius-sm;
  color: $primary;
  translate: all duration-50;
  z-index: 100;
}
</style>
