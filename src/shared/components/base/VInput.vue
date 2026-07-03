<script setup lang="ts">
import VueFeather from "vue-feather";

import VLoader from "./VLoader.vue";

const {
  id = "",
  label = "",
  type = "text",
  placeholder = "",
  modelValue = "",
  icon = "",
  loader = false,
  disabled = false,
  supportText = "",
  error = false,
  errorMessage = "",
} = defineProps<{
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string | number;
  icon?: string;
  loader?: boolean;
  disabled?: boolean;
  supportText?: string;
  error?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{ "update:modelValue": [value: string | number] }>();

const updateModelValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  if (type === "number" && value !== "") {
    value = Number(value);
  }

  emit("update:modelValue", value);
};
</script>

<template>
  <div class="input">
    <label
      v-if="label"
      :for="id"
      class="input__label"
      :class="{
        'input__label--disabled': disabled,
        'input__label--error': error,
      }"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>

    <div
      class="input__container"
      :class="{ 'input__container--disabled': disabled }"
      :aria-disabled="disabled"
    >
      <div
        v-if="$slots['icon-left'] || icon || loader"
        class="input__icon-left"
      >
        <slot name="icon-left">
          <VLoader v-if="loader" />
          <VueFeather
            v-else-if="icon"
            :type="icon"
          />
        </slot>
      </div>

      <input
        :id="id"
        v-bind="$attrs"
        :type="type"
        class="input__control"
        :class="{
          'input__control--error': error,
          'input__control--has-icon-left': $slots['icon-left'] || icon || loader,
          'input__control--has-icon-right': $slots['icon-right'],
        }"
        :disabled="disabled"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-invalid="error || undefined"
        :aria-describedby="
          error && errorMessage
            ? `${id}-error`
            : supportText
              ? `${id}-support`
              : undefined
        "
        @input="updateModelValue"
      >

      <div
        v-if="$slots['icon-right']"
        class="input__icon-right"
      >
        <slot name="icon-right" />
      </div>
    </div>

    <div
      v-if="error && errorMessage"
      class="input__error-wrapper"
    >
      <slot
        name="errorMsg"
        :message="errorMessage"
      >
        <span
          :id="`${id}-error`"
          class="input__error-message"
        >
          {{ errorMessage }}
        </span>
      </slot>
    </div>

    <div
      v-else-if="supportText"
      class="input__support-wrapper"
    >
      <slot name="sup-text">
        <span
          :id="`${id}-support`"
          class="input__support-text"
        >
          {{ supportText }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;

  &__label {
    font-family: $font-inter-medium;
    font-size: 0.9375rem;
    line-height: 1.4;
    color: var(--color-text);
    transition: color 0.2s ease;

    &--disabled {
      color: var(--color-text-secondary);
    }

    &--error {
      color: var(--color-error);
    }
  }

  &__container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;

    &--disabled {
      opacity: 0.7;
    }
  }

  &__control {
    width: 100%;
    min-height: 3rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--input-border);
    border-radius: $radius-xl;
    background: var(--input-bg-gradient);
    color: var(--input-text);
    font-family: $font-inter-regular;
    font-size: 1rem;
    line-height: 1.5;
    box-shadow: 0 6px 18px var(--color-shadow);
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease,
      color 0.25s ease;
    outline: none;

    &::placeholder {
      color: var(--input-placeholder);
    }

    &:hover:not(:disabled) {
      border-color: rgba(63, 127, 216, 0.32);
      background: var(--input-bg-gradient-hover);
    }

    &:focus {
      border-color: var(--color-primary);
      box-shadow:
        0 0 0 3px rgba(63, 127, 216, 0.16),
        0 10px 24px var(--color-shadow);
      background:var(--input-bg-gradient-hover);
    }

    &:hover:not(:disabled)::placeholder, &:focus::placeholder {
      color: var(--color-text);
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--color-surface-soft);
      color: var(--color-text-secondary);
      box-shadow: none;
    }

    &--error {
      border-color: var(--color-error);
      box-shadow: 0 0 0 3px rgba(216, 95, 95, 0.12);
    }

    &--has-icon-left {
      padding-left: 2.875rem;
    }

    &--has-icon-right {
      padding-right: 2.875rem;
    }
  }

  &__icon-left,
  &__icon-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--icon-color);
    pointer-events: none;
  }

  &__icon-left {
    left: 1rem;
  }

  &__icon-right {
    right: 1rem;
  }

  &__error-wrapper,
  &__support-wrapper {
    min-height: 1.125rem;
  }

  &__error-message {
    display: inline-block;
    font-family: $font-inter-regular;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: var(--color-error);
  }

  &__support-text {
    display: inline-block;
    font-family: $font-inter-regular;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: var(--color-text-secondary);
  }
}
</style>
