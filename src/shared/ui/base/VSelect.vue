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
          <button
            type="button"
            class="v-select__caret"
            @mousedown.prevent.stop="toggle"
          >
            <VueFeather
              type="chevron-up"
              class="v-select__caret-icon"
              aria-hidden="true"
            />
          </button>
        </template>
      </Multiselect>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.v-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $black;
  line-height: 1.5;

  &--disabled {
    opacity: 0.7;
  }

  &__label {
    white-space: nowrap;
  }

  &__field {
    min-width: 0;
  }

  &__caret {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  &__caret-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: $black;
    transform: rotate(180deg);
  }
}

:deep(.multiselect) {
  width: fit-content;
  color: $black;
}

:deep(.multiselect__input) {
  margin-bottom: 0;
  padding: 0;
}

:deep(.multiselect__tags) {
  min-height: 2rem;
  border: 1px solid $black;
  border-radius: $radius-s;
  background-color: white;
  color: $black;
  line-height: 1.5;
  transition: border-color 0.3s ease;
}

:deep(.multiselect__tags:focus-within) {
  border-color: $black;
}

:deep(.multiselect__single),
:deep(.multiselect__placeholder) {
  margin: 0;
  padding: 0;
  background: transparent;
  vertical-align: middle;
}

:deep(.multiselect__placeholder) {
  color: $black;
}

:deep(.multiselect__content-wrapper) {
  width: auto;
  min-width: 100%;
  margin-top: 0.25rem;
  border: 1px solid $black;
  border-top: 2px solid $black;
  border-radius: $radius-s;
  background-color: white;
  box-shadow: 0 0.625rem 1.5rem rgba(0, 0, 0, 0.12);
}

:deep(.multiselect__select) {
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

:deep(.multiselect__select::before) {
  display: none;
}

:deep(.multiselect__element),
:deep(.multiselect__option) {
  width: 100%;
}

:deep(.multiselect__option--highlight) {
  background-color: $black;
  color: $black;
}

:deep(.multiselect__option--selected) {
  background-color: $black;
  color: $black;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background-color: transparent;
  color: $black;
}

:deep(.multiselect--active:not(.multiselect--above) .multiselect__tags) {
  border-radius: $radius-s;
}

:deep(.multiselect--disabled) {
  pointer-events: none;
  color: $black;
  border-color: $black;
}

:deep(.multiselect--disabled .multiselect__select) {
  background: transparent;
}

.v-select--size-sm {
  :deep(.multiselect__tags) {
    padding: 0.375rem 2.2rem 0.375rem 0.5rem;
  }
}

.v-select--size-md {
  :deep(.multiselect__tags) {
    padding: 0.75rem 2.4rem 0.75rem 0.625rem;
  }
}
</style>
