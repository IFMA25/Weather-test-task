<script setup lang="ts">
import { ref, onMounted } from "vue";

import CitySearchInput from "@/features/weather/components/CitySearchInput.vue";
import WeatherCard from "@/features/weather/components/WeatherCard.vue";
import { useWeatherFeature } from "@/features/weather/composables/useWeatherFeature";
import type { CityOptionDto } from "@/features/weather/types";
import VButton from "@/shared/ui/base/VButton.vue";

const selectedCity = ref<CityOptionDto | null>(null);

const {
  weatherCards,
  isPending,
  addWeatherCard,
  removeWeatherCard,
  loadWeatherCards,
} = useWeatherFeature();

const onSelectCity = (city: CityOptionDto) => {
  selectedCity.value = city;
};

const onAddCity = async () => {
  if (!selectedCity.value) return;

  await addWeatherCard(selectedCity.value);
  selectedCity.value = null;
};

onMounted(() => {
  loadWeatherCards();
});
</script>

<template>
  <CitySearchInput
    :disabled="isPending"
    @select="onSelectCity"
  />

  <WeatherCard
    v-for="card in weatherCards"
    :key="card.id"
    :city="card.selectedCity"
    :weather="card.weather"
    :is-loading="card.isLoading"
    :error="card.error"
    @remove="() => removeWeatherCard(card.id)"
  />

  <VButton
    v-if="weatherCards.length < 5"
    :loading="isPending"
    text="Add City"
    @click="onAddCity"
  />
</template>
