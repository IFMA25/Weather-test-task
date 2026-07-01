<script setup lang="ts">
import VueFeather from "vue-feather";

const modelValue = defineModel<boolean>({ default: false });

const {
  validation,
  label,
  disabled = false,
} = defineProps<{
  validation?: { error: boolean; message: string };
  label?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label
    class="checkbox"
    :class="{
      'checkbox--disabled': disabled,
      'checkbox--error': validation?.error,
    }"
  >
    <div
      class="checkbox__box"
      :class="{ 'checkbox__box--checked': modelValue }"
    >
      <VueFeather
        v-if="modelValue"
        type="check"
        class="checkbox__check-icon"
      />
    </div>

    <input
      v-model="modelValue"
      :disabled="disabled"
      type="checkbox"
      class="checkbox__input"
    >

    <slot name="label">
      <span
        v-if="label"
        class="checkbox__label"
      >
        {{ label }}
      </span>
    </slot>

    <p
      v-if="validation?.error"
      class="checkbox__error"
    >
      {{ validation.message }}
    </p>
  </label>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/variables" as *;

.checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.3;
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--error {
    .checkbox__box {
      border-color: #d32f2f;
    }
  }

  &__box {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid $black;
    border-radius: $radius-s;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover:not(.checkbox__box--checked) {
      border-color: lighten($black, 20%);
    }

    &--checked {
      background-color: $black;
      border-color: $black;
      color: #fff;
    }
  }

  &__check-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__label {
    display: inline-block;
  }

  &__error {
    position: absolute;
    top: 100%;
    left: 0;
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #d32f2f;
  }
}
</style>
