<script setup lang="ts">
import { computed, useId } from "vue";
import VueFeather from "vue-feather";

const modelValue = defineModel<boolean>({ default: false });

const {
  label = "",
  icon = "",
  disabled = false,
  variant = "default",
} = defineProps<{
  label?: string;
  icon?: string;
  disabled?: boolean;
  variant?: "default" | "theme";
}>();

const inputId = useId();
const isChecked = computed(() => modelValue.value);
</script>

<template>
  <label
    :for="inputId"
    class="switch"
    :class="[
      `switch--${variant}`,
      {
        'switch--disabled': disabled,
        'switch--checked': isChecked,
      },
    ]"
  >
    <slot name="label">
      <span
        v-if="label"
        class="switch__label"
      >
        {{ label }}
      </span>
    </slot>

    <div class="switch__track">
      <div class="switch__track-content">
        <slot name="track-content" />
      </div>

      <div class="switch__thumb">
        <slot name="thumb-icon">
          <VueFeather
            v-if="icon"
            :type="icon"
            class="switch__thumb-icon"
          />
        </slot>
      </div>
    </div>

    <input
      :id="inputId"
      v-model="modelValue"
      type="checkbox"
      class="switch__input"
      :disabled="disabled"
    >
  </label>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

$switch-track-width: 2.75rem;
$switch-track-height: 1.5rem;
$switch-thumb-size: 1.25rem;
$switch-thumb-offset: 0.125rem;

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__label {
    color: var(--color-text);
    font-family: $font-inter-medium;
  }

  &__track {
    position: relative;
    display: flex;
    align-items: center;
    width: $switch-track-width;
    height: $switch-track-height;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: $switch-track-height;
    background: var(--card-bg);
    box-shadow: inset 0 1px 2px var(--color-shadow);
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;
    flex-shrink: 0;
    overflow: hidden;
  }

  &__track-content {
    width: 100%;
    height: 100%;
  }

  &__thumb {
    position: absolute;
    top: 50%;
    left: $switch-thumb-offset;
    transform: translateY(-50%);
    width: $switch-thumb-size;
    height: $switch-thumb-size;
    border-radius: 50%;
    background: var(--color-text-secondary);
    box-shadow:
      0 0.125rem 0.375rem var(--color-shadow),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transition:
      left 0.3s ease,
      transform 0.3s ease,
      background 0.3s ease,
      box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--checked &__thumb {
    left: calc(100% - #{$switch-thumb-offset});
    transform: translate(-100%, -50%);
  }

  &__thumb-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &--theme {
    .switch__track {
      width: 4.375rem;
      height: 2.25rem;
      border-radius: $radius-xl;
      backdrop-filter: blur(8px);
    }

    .switch__thumb {
      width: 1.75rem;
      height: 1.75rem;
      background: linear-gradient(
        180deg,
        var(--button-bg) 0%,
        var(--button-bg-hover) 100%
      );
    }

    &.switch--checked .switch__thumb {
      background: linear-gradient(
        180deg,
        var(--color-primary) 0%,
        var(--color-primary-hover) 100%
      );
    }
  }
}
</style>
