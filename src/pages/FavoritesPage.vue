<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";

import ConfirmModal from "@/features/weather/components/ConfirmModal.vue";
import WeatherCard from "@/shared/components/common/WeatherCard.vue";
import { useWeatherStore } from "@/shared/store/weather.store";

const weatherStore = useWeatherStore();

const deletePayload = ref<{ cityId: number; cityName: string } | null>(null);

const deleteModalRef =
  useTemplateRef<InstanceType<typeof ConfirmModal>>("confirmModal");

const openDeleteModal = (cityId: number, cityName: string) => {
  deletePayload.value = { cityId, cityName };
  deleteModalRef.value?.open();
};

const confirmDelete = () => {
  if (!deletePayload.value) return;

  weatherStore.removeFavoriteCity(deletePayload.value.cityId);
  deleteModalRef.value?.close();
  deletePayload.value = null;
};

onMounted(() => {
  weatherStore.loadFavoriteWeatherCards();
});
</script>

<template>
  <ConfirmModal
    id="confirmModal"
    ref="confirmModal"
    :entity-name="deletePayload?.cityName ?? ''"
    @confirm="confirmDelete"
  />

  <h2 class="favorites__title">
    {{ $t("favoritesPage.title") }}
  </h2>

  <div class="favorites">
    <WeatherCard
      v-for="card in weatherStore.favoriteWeatherCards"
      :key="card.id"
      :city="card.selectedCity"
      :weather="card.weather"
      :is-loading="card.isLoading"
      :error="card.error"
      :show-favorite-actions="false"
      @remove="openDeleteModal(card.selectedCity?.id ?? 0, card.selectedCity?.name ?? '')"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables.scss' as *;

.favorites {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;

  &__title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
  }
}
</style>
