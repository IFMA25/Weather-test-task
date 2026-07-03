<script setup lang="ts">
import VueFeather from "vue-feather";

const {
  id = "",
  isOpen = false,
  icon = "chevron-down",
  title = "",
  disabled = false,
} = defineProps<{
  id?: string;
  isOpen?: boolean;
  icon?: string;
  title?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  toggle: [id: string];
}>();

const onToggle = () => {
  if (!disabled) {
    emit("toggle", id);
  }
};

const onEnter = (el: Element) => {
  if (el instanceof HTMLElement) {
    el.style.height = "0";
    void el.offsetHeight;
    el.style.height = `${el.scrollHeight}px`;
  }
};

const onAfterEnter = (el: Element) => {
  if (el instanceof HTMLElement) {
    el.style.height = "auto";
  }
};

const onLeave = (el: Element) => {
  if (el instanceof HTMLElement) {
    el.style.height = `${el.scrollHeight}px`;
    void el.offsetHeight;
    el.style.height = "0";
  }
};
</script>

<template>
  <div
    class="v-accordion-item"
    :class="{ 'v-accordion-item--disabled': disabled }"
  >
    <button
      type="button"
      class="v-accordion-item__trigger"
      :aria-expanded="isOpen"
      :aria-controls="`accordion-content-${id}`"
      :disabled="disabled"
      @click="onToggle"
    >
      <div class="v-accordion-item__header">
        <VueFeather
          :type="icon"
          class="v-accordion-item__icon"
          :class="{ 'v-accordion-item__icon--open': isOpen }"
          aria-hidden="true"
        />
        <slot name="title">
          <span class="v-accordion-item__title">
            {{ title }}
          </span>
        </slot>
      </div>
    </button>

    <Transition
      name="accordion"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div
        v-show="isOpen"
        :id="`accordion-content-${id}`"
        class="v-accordion-item__content"
      >
        <div class="v-accordion-item__body">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.v-accordion-item {
  border-bottom: 1px solid $black;

  &:last-child {
    border-bottom: 0;
  }

  &--disabled {
    opacity: 0.6;

    .v-accordion-item__trigger {
      cursor: not-allowed;
    }
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: $black;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  &__icon {
    flex-shrink: 0;
    transition: transform 0.3s ease;

    &--open {
      transform: rotate(270deg);
    }
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__content {
    overflow: hidden;
    transition: height 0.3s ease;
  }

  &__body {
    padding: 0.25rem 1rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
