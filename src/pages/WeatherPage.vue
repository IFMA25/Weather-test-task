<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";

import AlertModal from "@/features/weather/components/AlertModal.vue";
import CitySearchInput from "@/features/weather/components/CitySearchInput.vue";
import ConfirmModal from "@/features/weather/components/ConfirmModal.vue";
import VButton from "@/shared/components/base/VButton.vue";
import VLoader from "@/shared/components/base/VLoader.vue";
import WeatherCard from "@/shared/components/common/WeatherCard.vue";
import { useWeatherStore } from "@/shared/store/useWeatherStore";
import { Coordinates } from "@/shared/types/storage";
import { CityOptionDto } from "@/shared/types/weather";

const selectedCity = ref<CityOptionDto | null>(null);
const deletePayload = ref<{ cardId: string; cityName: string } | null>(null);

const deleteModalRef = useTemplateRef<InstanceType<typeof ConfirmModal>>("confirmModal");
const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>("alertModal");
const citySearchInputRef = useTemplateRef<InstanceType<typeof CitySearchInput>>("citySearchInput");
const weatherStore = useWeatherStore();

const onSelectCity = (city: CityOptionDto) => {
  selectedCity.value = city;
};

const onAddCity = async () => {
  if (!selectedCity.value) return;

  const result = await weatherStore.addWeatherCard(selectedCity.value);

  if (!result?.success) {
    if (result.reason === "card-limit") {
      alertModalRef.value?.open();
    }
    return;
  }

  selectedCity.value = null;
  citySearchInputRef.value?.reset();
};

const handleToggleFavorite = async ({
  cityId,
  checked,
  coords,
}: {
  cityId: number;
  checked: boolean;
  coords: Coordinates;
}) => {
  const result = await weatherStore.toggleFavorite(cityId, coords, checked);

  if (!result.success && result.reason === "card-limit") {
    alertModalRef.value?.open();
  }
};

const openDeleteModal = (cardId: string, cityName: string) => {
  deletePayload.value = { cardId, cityName };
  deleteModalRef.value?.open();
};

const confirmDelete = () => {
  if (!deletePayload.value) return;

  weatherStore.removeWeatherCard(deletePayload.value.cardId);
  deleteModalRef.value?.close();
  deletePayload.value = null;
};

onMounted(() => {
  weatherStore.loadWeatherCards();
});

</script>

<template>
  <ConfirmModal
    id="confirmModal"
    ref="confirmModal"
    :entity-name="deletePayload?.cityName ?? ''"
    @confirm="confirmDelete"
  />
  <AlertModal
    id="alertModal"
    ref="alertModal"
  />
  <div class="weather-page__wrapper">
    <CitySearchInput
      ref="citySearchInput"
      :disabled="weatherStore.isPending"
      @select="onSelectCity"
    />
    <VButton
      :loading="weatherStore.isPending"
      icon="plus"
      variant="icon"
      @click="onAddCity"
    />
  </div>
  <div
    v-if="weatherStore.weatherCards.length && !weatherStore.isPending"
    class="weather-page__cards"
  >
    <WeatherCard
      v-for="card in weatherStore.weatherCards"
      :key="card.id"
      :city="card.selectedCity"
      :weather="card.weather"
      :error="card.error"
      @remove="openDeleteModal(card.id, card.selectedCity?.name ?? '')"
      @toggle-favorite="handleToggleFavorite"
    />
  </div>
  <div
    v-else-if="weatherStore.isPending"
    class="weather-page__loader page-loader"
  >
    <VLoader />
  </div>
  <div
    v-else
    class="weather-page__state fallback-state"
  >
    {{ $t("weather.selectCity") }}
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;
.weather-page {
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9375rem;
  }
  &__cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: -0.9375rem;
    margin-right: -0.9375rem;
  }
}
</style>
