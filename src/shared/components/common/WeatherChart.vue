<script setup lang="ts">
import Chart from "chart.js/auto";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { getWeatherForecast } from "@/shared/api/weatherApi";
import VButton from "@/shared/components/base/VButton.vue";
import VSkeleton from "@/shared/components/base/VSkeleton.vue";
import type {
  CityOptionDto,
  ForecastItemDto,
  ForecastResponseDto,
  PreparedChartData,
} from "@/shared/types/weather";

type ChartMode = "day" | "fiveDays";

const { city } = defineProps<{
  city: CityOptionDto | null;
}>();

const { t, locale } = useI18n();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);
const mode = ref<ChartMode>("day");
const isLoading = ref(false);
const error = ref<string | null>(null);
const forecast = ref<ForecastResponseDto | null>(null);

const formatHourLabel = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDayLabel = (dateKey: string) =>
  new Date(`${dateKey}T12:00:00`).toLocaleDateString(locale.value, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const getDayChartData = (items: ForecastItemDto[]): PreparedChartData => {

  const firstAvailableDay = items[0].dt_txt.slice(0, 10);

  const dayItems = items
    .filter((item) => item.dt_txt.slice(0, 10) === firstAvailableDay)
    .sort((a, b) => a.dt - b.dt);

  return {
    labels: dayItems.map((item) => formatHourLabel(item.dt)),
    values: dayItems.map((item) => Math.round(item.main.temp)),
  };
};

const getFiveDaysChartData = (items: ForecastItemDto[]): PreparedChartData => {
  const grouped = items.reduce<Record<string, ForecastItemDto[]>>((acc, item) => {
    const dateKey = item.dt_txt.slice(0, 10);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(item);
    return acc;
  }, {});

  const entries = Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(0, 5);

  return {
    labels: entries.map(([dateKey]) => formatDayLabel(dateKey)),
    values: entries.map(([, dayItems]) => {
      const averageTemperature =
        dayItems.reduce((sum, item) => sum + item.main.temp, 0) / dayItems.length;

      return Number(averageTemperature.toFixed(1));
    }),
  };
};

const modes = computed(() => ({
  day: {
    key: "day" as const,
    title: t("weatherChart.dayTitle"),
    datasetLabel: t("weatherChart.datasetDay"),
    buttonText: t("weatherChart.dayButton"),
    prepareData: (payload: ForecastResponseDto) =>
      getDayChartData(payload.list),
  },
  fiveDays: {
    key: "fiveDays" as const,
    title: t("weatherChart.fiveDaysTitle"),
    datasetLabel: t("weatherChart.datasetFiveDays"),
    buttonText: t("weatherChart.fiveDaysButton"),
    prepareData: (payload: ForecastResponseDto) =>
      getFiveDaysChartData(payload.list),
  },
}));

const currentModeConfig = computed(() => modes.value[mode.value]);

const chartTitle = computed(() => currentModeConfig.value.title);

const chartModes = computed(() => Object.values(modes.value));

const destroyChart = () => {
  if (!chartInstance.value) return;

  chartInstance.value.destroy();
  chartInstance.value = null;
};

const renderChart = () => {
  if (!canvasRef.value || !forecast.value || isLoading.value) return;

  const preparedData = currentModeConfig.value.prepareData(forecast.value);

  if (!preparedData.labels.length || !preparedData.values.length) {
    destroyChart();
    return;
  }

  destroyChart();

  chartInstance.value = new Chart(canvasRef.value, {
    type: "line",
    data: {
      labels: preparedData.labels,
      datasets: [
        {
          label: currentModeConfig.value.datasetLabel,
          data: preparedData.values,
          borderColor: "#3f7fd8",
          backgroundColor: "rgba(63, 127, 216, 0.18)",
          pointBackgroundColor: "#e26e0f",
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: "#e26e0f",
          pointHoverBorderColor: "#ffffff",
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 3,
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 350,
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#183153",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y}°C`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#4b6480",
          },
          grid: {
            color: "rgba(24, 49, 83, 0.08)",
          },
          border: {
            color: "rgba(24, 49, 83, 0.12)",
          },
        },
        y: {
          ticks: {
            color: "#4b6480",
            callback: (value) => `${value}°`,
          },
          grid: {
            color: "rgba(24, 49, 83, 0.08)",
          },
          border: {
            color: "rgba(24, 49, 83, 0.12)",
          },
        },
      },
    },
  });
};

const loadForecast = async () => {
  if (!city) return;

  try {
    isLoading.value = true;
    error.value = null;

    forecast.value = await getWeatherForecast(city.lat, city.lon);
  } catch {
    error.value = t("weather.error");
    forecast.value = null;
    destroyChart();
  } finally {
    isLoading.value = false;
  }
};

const setMode = async (nextMode: ChartMode) => {
  if (mode.value === nextMode && forecast.value) return;

  mode.value = nextMode;
  await loadForecast();
};

watch(
  [forecast, canvasRef, mode, locale],
  () => {
    renderChart();
  },
  { flush: "post" },
);

watch(
  () => city?.id,
  async (newCityId, oldCityId) => {
    if (!newCityId || newCityId === oldCityId) return;

    forecast.value = null;
    mode.value = "day";
    await loadForecast();
  },
);

onMounted(async () => {
  mode.value = "day";
  await loadForecast();
});

onBeforeUnmount(() => {
  destroyChart();
});
</script>

<template>
  <div class="weather-chart">
    <div class="weather-chart__toolbar">
      <div class="weather-chart__tabs">
        <VButton
          v-for="chartMode in chartModes"
          :key="chartMode.key"
          :text="chartMode.buttonText"
          variant="main"
          :class="{ 'weather-chart__tab--active': mode === chartMode.key }"
          @click="setMode(chartMode.key)"
        />
      </div>

      <div class="weather-chart__caption">
        {{ chartTitle }}
      </div>
    </div>

    <div
      v-if="isLoading"
      class="weather-chart__loading"
    >
      <VSkeleton
        width="100%"
        height="260px"
        rounded="md"
      />
    </div>

    <div
      v-else-if="error"
      class="weather-chart__error"
    >
      {{ error }}
    </div>

    <div
      v-else-if="forecast"
      class="weather-chart__canvas-wrap"
    >
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.weather-chart {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  background: linear-gradient(180deg, var(--card-bg) 0%, var(--color-surface-soft) 100%);
  box-shadow: 0 0.5rem 1.25rem var(--color-shadow);

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__tab--active {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
      box-shadow: 0 0.25rem 0.875rem rgba(63, 127, 216, 0.28);
  }

  &__caption {
    font-size: 0.875rem;
    font-family: $font-inter-semibold;
    color: var(--color-text-secondary);
  }

  &__canvas-wrap {
    width: 100%;
    height: 16.25rem;
  }

  &__loading {
    padding: 0.25rem 0;
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 10rem;
    text-align: center;
    color: var(--color-error);
    font-family: $font-inter-medium;
  }
}

@media (max-width: $xs) {
  .weather-chart {
    &__toolbar {
      flex-direction: column;
      align-items: flex-start;
    }

    &__canvas-wrap {
      height: 14rem;
    }
  }
}
</style>
