<script setup lang="ts">
import { computed, useId } from "vue";
import VueFeather from "vue-feather";

const modelValue = defineModel<boolean>({ default: false });

const {
  label = "",
  icon = "",
  disabled = false,
} = defineProps<{
  label?: string;
  icon?: string;
  disabled?: boolean;
}>();

const inputId = useId();

const isChecked = computed(() => modelValue.value);
</script>

<template>
  <label
    :for="inputId"
    class="switch"
    :class="{ 'switch--disabled': disabled }"
  >
    <slot name="label">
      <span
        v-if="label"
        class="switch__label"
      >
        {{ label }}
      </span>
    </slot>

    <div
      class="switch__track"
      :class="{ 'switch__track--checked': isChecked }"
    >
      <slot />
      <div
        class="switch__thumb"
        :class="{ 'switch__thumb--checked': isChecked }"
      >
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

$track-width: 2.75rem;
$track-height: 1.5rem;
$thumb-size: 1.25rem;
$thumb-offset: 0.125rem;

.switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__label {
    user-select: none;

    .switch--disabled & {
      color: #9e9e9e;
    }
  }

  &__track {
    position: relative;
    width: $track-width;
    height: $track-height;
    border-radius: $track-height;
    border: 1px solid #bdbdbd;
    background-color: #e0e0e0;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    flex-shrink: 0;

    &--checked {
      background-color: $black;
      border-color: $black;
    }
  }

  &__thumb {
    position: absolute;
    top: 50%;
    left: $thumb-offset;
    transform: translateY(-50%);
    width: $thumb-size;
    height: $thumb-size;
    border-radius: 50%;
    background-color: #9e9e9e;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.3s ease, background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &--checked {
      left: calc(100% - #{$thumb-offset});
      transform: translate(-100%, -50%);
      background-color: #fff;
    }
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
}
</style>
