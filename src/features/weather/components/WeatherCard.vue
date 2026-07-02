<script setup lang="ts">
import { computed } from "vue";

import type { CityOptionDto, WeatherDto } from "../types";

import VLoader from "@/shared/ui/base/VLoader.vue";

const props = defineProps<{
  city: CityOptionDto | null;
  weather: WeatherDto | null;
  isLoading: boolean;
  error: string | null;
}>();

const temperature = computed(() =>
  props.weather ? Math.round(props.weather.main.temp) : null,
);
</script>

<template>
  <section class="weather-card">
    <div
      v-if="!city"
      class="weather-card__state"
    >
      {{ $t("weather.selectCity") }}
    </div>

    <div
      v-else-if="isLoading"
      class="weather-card__state"
    >
      <VLoader />
    </div>

    <div
      v-else-if="error"
      class="weather-card__state weather-card__state--error"
    >
      {{ error }}
    </div>

    <div
      v-else-if="weather"
      class="weather-card__content"
    >
      <div class="weather-card__temperature">
        {{ temperature }}°C
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-card {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  background-color: #ffffff;
}

.weather-card__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  color: #666666;
  text-align: center;
}

.weather-card__state--error {
  color: #c62828;
}

.weather-card__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
