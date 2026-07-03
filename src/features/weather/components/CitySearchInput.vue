<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

import { useCityAutocomplete } from "../composables/useCityAutocomplete";

import VInput from "@/shared/components/base/VInput.vue";
import VSkeleton from "@/shared/components/base/VSkeleton.vue";
import { CityOptionDto } from "@/shared/types/weather";

const SKELETON_COUNT = 5;

const { disabled } = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [city: CityOptionDto];
}>();

const rootRef = ref<HTMLElement | null>(null);

const {
  query,
  cities,
  isLoading,
  isOpen,
  selectCity,
  reset,
} = useCityAutocomplete();

const onSelect = (city: CityOptionDto) => {
  const selectedCity = selectCity(city);
  emit("select", selectedCity);
};

const onFocus = () => {
  if (cities.value.length > 0) {
    isOpen.value = true;
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

onClickOutside(rootRef, () => {
  closeDropdown();
});

defineExpose({
  reset,
});
</script>

<template>
  <div
    ref="rootRef"
    class="search-input"
  >
    <VInput
      v-model="query"
      :placeholder="$t('citySearchInput.placeholder')"
      autocomplete="off"
      :disabled="disabled"
      @focus="onFocus"
    />
    <div
      v-if="isOpen || isLoading"
      class="search-input__wrapper"
    >
      <ul
        v-if="isLoading"
        class="search-input__dropdown"
      >
        <li
          v-for="i in SKELETON_COUNT"
          :key="i"
          class="search-input__option search-input__option--skeleton"
        >
          <VSkeleton
            width="40%"
            height="1.2rem"
          />
          <VSkeleton
            width="25%"
            height="0.875rem"
          />
        </li>
      </ul>
      <ul
        v-else-if="cities.length"
        class="search-input__dropdown"
      >
        <li
          v-for="city in cities"
          :key="`${city.name}-${city.lat}-${city.lon}`"
          class="search-input__option"
          @mousedown.prevent="onSelect(city)"
        >
          <span class="search-input__city">{{ city.name }}</span>
          <span class="search-input__meta">
            {{ city.state ? `${city.state}, ` : "" }}{{ city.country }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables.scss' as *;
.search-input {
  position: relative;
  width: 90%;

  &__wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: white;
    border: 1px solid $black;
    border-top: none;
    border-radius: $radius-s;
    box-shadow: 0 0.625rem 1.5rem rgba(0, 0, 0, 0.12);
  }

  &__dropdown {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__option {
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-surface);
    }

    &--skeleton {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: default;

      &:hover {
        background-color: transparent;
      }
    }
  }

  &__city {
    font-weight: 500;
  }

  &__meta {
    color: var(--input-meta);
    font-size: 0.875rem;
  }
}
</style>
