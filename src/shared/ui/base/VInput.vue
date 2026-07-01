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

<style lang="scss">

</style>
