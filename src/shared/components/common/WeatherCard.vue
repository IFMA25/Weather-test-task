<script setup lang="ts">
import { computed, ref } from "vue";
import VueFeather from "vue-feather";

import VButton from "../base/VButton.vue";
import VSkeleton from "../base/VSkeleton.vue";
import VAccordionItem from "../base/accordion/VAccordionItem.vue";

import WeatherForecastChart from "@/shared/components/common/WeatherChart.vue";
import { Coordinates } from "@/shared/types/storage";
import type { CityOptionDto, WeatherDto } from "@/shared/types/weather";


const { city, weather, isLoading, error, showFavoriteActions = true } = defineProps<{
  city: CityOptionDto | null;
  weather: WeatherDto | null;
  isLoading: boolean;
  error: string | null;
  showFavoriteActions?: boolean;
}>();

const isChartOpen = ref(false);

const emit = defineEmits<{
  toggleFavorite: [payload: { cityId: number; checked: boolean, coords: Coordinates }];
  remove: [];
}>();

const onFavoriteChange = (event: Event) => {
  emit("toggleFavorite", {
    cityId: city.id,
    checked: (event.target as HTMLInputElement).checked,
    coords: {
      lat: city.lat,
      lon: city.lon,
    },
  });
};

const temperature = computed(() =>
  weather ? Math.round(weather.main.temp) : null,
);

const weatherInfo = computed(() => weather?.weather?.[0] ?? null);

const feelsLike = computed(() =>
  weather ? Math.round(weather.main.feels_like) : null,
);

const humidity = computed(() => weather?.main.humidity ?? null);
const pressure = computed(() => weather?.main.pressure ?? null);
const windSpeed = computed(() => weather?.wind.speed ?? null);

const formatTime = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

const sunrise = computed(() => formatTime(weather?.sys?.sunrise));
const sunset = computed(() => formatTime(weather?.sys?.sunset));

const iconUrl = computed(() =>
  weatherInfo.value?.icon
    ? `https://openweathermap.org/img/wn/${weatherInfo.value.icon}@2x.png`
    : "",
);

const onRemove = () => {
  emit("remove");
};
</script>

<template>
  <section class="weather-card">
    <div
      v-if="isLoading"
      class="weather-card__skeleton"
    >
      <VSkeleton
        width="100%"
        height="100px"
        rounded="md"
      />
    </div>

    <div
      v-else-if="error"
      class="weather-card__error"
    >
      {{ error }}
    </div>

    <div
      v-else-if="weather"
      class="weather-card__content"
    >
      <div class="weather-card__main">
        <h3 class="weather-card__city-name">
          {{ city.name }}, {{ city.country }}
        </h3>
        <div class="weather-card__actions">
          <label
            v-if="showFavoriteActions"
            class="weather-card__favorite favorite-toggle"
          >
            <input
              :checked="city.favorite"
              type="checkbox"
              class="favorite-toggle__input"
              :aria-label="$t('weatherCard.addToFavorites')"
              @change="onFavoriteChange"
            >

            <span class="favorite-toggle__button">
              <VueFeather
                type="heart"
                class="favorite-toggle__icon"
              />
            </span>
          </label>

          <VButton
            variant="icon"
            icon="trash-2"
            @click="onRemove"
          />
        </div>
      </div>
      <div class="weather-card__summary">
        <div class="weather-card__img">
          <img
            v-if="iconUrl"
            :src="iconUrl"
            :alt="weatherInfo?.description || 'weather icon'"
            class="weather-card__icon"
          >
        </div>
        <div>
          <div class="weather-card__temperature">
            {{ temperature }}°C
          </div>
          <div class="weather-card__description">
            {{ weatherInfo?.description }}
          </div>
        </div>
      </div>
      <div class="weather-card__grid">
        <div class="weather-card__item">
          <span class="weather-card__label">{{ $t('weatherCard.feelsLike') }}</span>
          <span class="weather-card__value">{{ feelsLike }}°C</span>
        </div>

        <div class="weather-card__item">
          <span class="weather-card__label">{{ $t('weatherCard.humidity') }}</span>
          <span class="weather-card__value">{{ humidity }}%</span>
        </div>

        <div class="weather-card__item">
          <span class="weather-card__label">{{ $t('weatherCard.wind') }}</span>
          <span class="weather-card__value">{{ windSpeed }} m/s</span>
        </div>

        <div class="weather-card__item">
          <span class="weather-card__label">{{ $t('weatherCard.pressure') }}</span>
          <span class="weather-card__value">{{ pressure }} hPa</span>
        </div>

        <div class="weather-card__item">
          <VueFeather
            type="sunrise"
            size="16"
          />
          <span class="weather-card__value">{{ sunrise }}</span>
        </div>

        <div class="weather-card__item">
          <VueFeather
            type="sunset"
            size="16"
          />
          <span class="weather-card__value">{{ sunset }}</span>
        </div>
      </div>
      <VAccordionItem
        id="forecast-chart"
        class="weather-card__accordion"
        :is-open="isChartOpen"
        :title="$t('weatherChart.accordionTitle')"
        @toggle="isChartOpen = !isChartOpen"
      >
        <WeatherForecastChart
          v-if="isChartOpen"
          :city="city"
        />
      </VAccordionItem>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.weather-card {
  width: calc(50% - 1.875rem);
  margin: 1.5rem 0.9375rem 0;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-soft) 100%);
  box-shadow: 0 8px 24px var(--color-shadow);

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 11.25rem;
    text-align: center;
    color: var(--color-error);
  }

  &__skeleton {
    padding: 0.5rem 0;
  }

  &__city-name {
    font-size: 1.5rem;
    line-height: 1;
    font-family: $font-inter-bold;
    color: var(--color-text);
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.875rem;
    height: 3.875rem;
    flex-shrink: 0;
    border-radius: $radius-s;
    background: var(--color-bg-img);
  }

  &__icon {
    width: 3.625rem;
    height: 3.625rem;
    object-fit: contain;
  }

  &__temperature {
    font-size: 2rem;
    line-height: 1;
    font-family: $font-inter-bold;
    color: var(--color-text);
  }

  &__description {
    margin-top: 0.375rem;
    font-size: 0.95rem;
    line-height: 1.35;
    color: var(--color-text-secondary);
    text-transform: capitalize;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__favorite {
    flex-shrink: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.875rem 1.5rem;
    padding: 0 1.125rem;
  }

   &__accordion {
    margin-top: 0.5rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  &__label {
    font-size: 0.8125rem;
    line-height: 1.2;
    color: var(--color-text-secondary);
  }

  &__value {
    font-size: 1rem;
    line-height: 1.3;
    font-family: $font-inter-semibold;
    color: var(--color-text);
    white-space: nowrap;
  }
}

.favorite-toggle {
  position: relative;
  display: inline-flex;
  cursor: pointer;

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid rgba(145, 156, 171, 0.28);
    background: linear-gradient(180deg, #f3f5f8 0%, #dde3ea 100%);
    transition:
      transform 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease,
  }

  &:hover &__button {
    transform: translateY(-1px);
  }

  &__icon {
    width: 0.95rem;
    height: 0.95rem;
    color: #6b7280;
    fill: transparent;
    transition:
      color 0.2s ease,
      fill 0.2s ease,
      transform 0.2s ease;
  }

  &__input:checked + &__button {
    background: linear-gradient(135deg, #f29b4b 0%, #e67817 100%);
    border-color: #e67817;
  }

  &__input:checked + &__button &__icon {
    color: #ffffff;
    fill: currentColor;
    transform: scale(1.05);
  }

  &__input:focus-visible + &__button {
    outline: 2px solid rgba(63, 127, 216, 0.35);
    outline-offset: 3px;
  }
}
</style>
