<script setup lang="ts" generic="T extends Option">
import { computed } from "vue";
import VueFeather from "vue-feather";
import Multiselect from "vue-multiselect";

export interface Option {
  [key: string]: unknown;
}

interface Props {
  id:string;
  options: T[];
  labelText?: string;
  multiple?: boolean;
  closeOnSelect?: boolean;
  openDirection?: "top" | "bottom";
  placeholder?: string;
  showLabels?: boolean;
  allowEmpty?: boolean;
  multiselectProps?: Record<string, unknown>;
  searchable?: boolean;
  label?: string;
  trackBy?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const {
  id = "select",
  labelText="",
  options = [],
  multiple = false,
  closeOnSelect: closeOnSelectProp,
  openDirection = "bottom",
  placeholder = "",
  showLabels = false,
  allowEmpty = false,
  multiselectProps = {},
  searchable = false,
  label,
  trackBy="key",
  disabled = false,
  size = "md",
} = defineProps<Props>();

const model = defineModel<string | string[] | null>();

const getKey = (option: T): string => String(option[trackBy ?? "key"]);

const internalModel = computed({
  get: () => {
    if (model.value == null) return multiple ? [] : null;

    if (multiple) {
      const values = Array.isArray(model.value) ? model.value : [model.value];
      return options.filter(option => values.includes(getKey(option)));
    }

    return options.find(option => getKey(option) === model.value) ?? null;
  },
  set: (value: T | T[] | null) => {
    if (value == null) {
      model.value = multiple ? [] : null;
      return;
    }

    if (Array.isArray(value)) {
      model.value = value.map(getKey);
    } else {
      model.value = getKey(value);
    }
  },
});

const closeOnSelectComputed = computed(() =>
  closeOnSelectProp ?? !multiple,
);
</script>

<template>
  <div
    class="v-select"
    :class="[
      `v-select--size-${size}`,
      { 'v-select--disabled': disabled },
    ]"
  >
    <label
      v-if="labelText"
      :for="id"
      class="v-select__label"
    >
      {{ labelText }}
    </label>

    <div class="v-select__field">
      <Multiselect
        :id="id"
        v-model="internalModel"
        v-bind="multiselectProps"
        :options="options"
        :multiple="multiple"
        :close-on-select="closeOnSelectComputed"
        :open-direction="openDirection"
        :placeholder="placeholder"
        :show-labels="showLabels"
        :allow-empty="allowEmpty"
        :searchable="searchable"
        :label="label"
        :track-by="trackBy"
        :disabled="disabled"
        aria-label="pick a value"
      >
        <template #caret="{ toggle }">
          <span
            class="v-select__caret"
            @mousedown.prevent.stop="toggle"
          >
            <VueFeather
              type="chevron-up"
              class="v-select__caret-icon"
            />
          </span>
        </template>
      </Multiselect>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.v-select {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  line-height: 1.5rem;
  color: var(--color-text);
}

.v-select__label {
  white-space: nowrap;
}

.v-select__field {
  position: relative;
}

.v-select__caret {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.v-select__caret-icon {
  width: 1.25rem;
  height: 1.25rem;
  transform: rotate(180deg);
}

:deep(.multiselect) {
  color: var(--color-text);
  width: fit-content;
}

:deep(.multiselect__input) {
  margin-bottom: 0;
  padding: 0;
}

:deep(.multiselect__tags) {
  border-radius: $radius-s;
  border: 1px solid var(--color-border);
  line-height: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
  color: var(--color-text);
  background-color: var(--card-bg);
  padding-bottom: 0.5rem;
}

:deep(.multiselect__tags:focus-within) {
  border-color: var(--color-primary);
  border-radius: $radius-s;
}

:deep(.multiselect--size-sm .multiselect__tags) {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 2.2rem;
}

:deep(.multiselect--size-md .multiselect__tags) {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 0.625rem;
  padding-right: 2.4rem;
}

:deep(.multiselect__single),
:deep(.multiselect__placeholder) {
  margin: 0;
  padding: 0;
  background: transparent;
  vertical-align: middle;
}

:deep(.multiselect__placeholder) {
  color: var(--input-placeholder);
}

:deep(.multiselect__content-wrapper) {
  min-width: 100%;
  width: auto;
  margin-top: 4px;
  border-radius: $radius-s;
  border: 1px solid var(--color-border);
  background-color: var(--card-bg) !important;
  padding: 0.5rem 0.75rem;
}

:deep(.multiselect__select) {
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.multiselect__select::before) {
  display: none;
}

:deep(.multiselect__option--highlight) {
  color: var(--color-text) !important;
  background-color: var(--color-surface-soft) !important;
  font-weight: 400;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  color: var(--color-text) !important;
  background-color: var(--color-surface-soft) !important;
  font-weight: 700;
}

:deep(.multiselect__option--selected) {
  color: var(--color-text) !important;
  background-color: var(--color-surface) !important;
  font-weight: 700;
}

:deep(.multiselect--active:not(.multiselect--above) .multiselect__tags) {
  border-radius: $radius-s;
}

:deep(.multiselect--disabled .multiselect__select) {
  background: transparent;
}
</style>
