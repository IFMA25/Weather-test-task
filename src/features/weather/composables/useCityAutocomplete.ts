import { watchIgnorable } from "@vueuse/core";
import axios from "axios";
import { onUnmounted, reactive, toRefs } from "vue";
import { useI18n } from "vue-i18n";

import { searchCities } from "@/features/weather/api/weatherApi";
import { CityAutocompleteState, CityOptionDto } from "@/features/weather/types";


const DEBOUNCE_DELAY = 400;
const MIN_QUERY_LENGTH = 3;

export const useCityAutocomplete = () => {
  const { t } = useI18n();

  const autocompleteState: CityAutocompleteState = reactive({
    query: "",
    cities: [],
    isLoading: false,
    isOpen: false,
    error: null,
  });

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  const clearDebounce = () => {
    if (!debounceTimeout) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  };

  const abortRequest = () => {
    if (!abortController) return;

    abortController.abort();
    abortController = null;
  };

  const clearResults = () => {
    autocompleteState.cities = [];
    autocompleteState.isOpen = false;
  };

  const resetUiState = () => {
    clearResults();
    autocompleteState.error = null;
    autocompleteState.isLoading = false;
  };

  const selectCity = (city: CityOptionDto) => {
    clearDebounce();
    abortRequest();

    ignoreUpdates(() => {
      autocompleteState.query = `${city.name}, ${city.country}`;
    });

    clearResults();
    autocompleteState.error = null;

    return city;
  };

  const fetchCities = async (query: string) => {
    abortRequest();

    const controller = new AbortController();
    abortController = controller;

    autocompleteState.isLoading = true;
    autocompleteState.error = null;

    try {
      const cities = await searchCities(query, controller.signal);

      if (abortController !== controller) return;

      autocompleteState.cities = cities;
      autocompleteState.isOpen = cities.length > 0;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
        return;
      }

      clearResults();
      autocompleteState.error = t("citySearchInput.error");
    } finally {
      if (abortController === controller) {
        autocompleteState.isLoading = false;
        abortController = null;
      }
    }
  };

  const { ignoreUpdates } = watchIgnorable(
    () => autocompleteState.query,
    (value) => {
      clearDebounce();

      const normalizedValue = value.trim();

      if (normalizedValue.length < MIN_QUERY_LENGTH) {
        abortRequest();
        resetUiState();
        return;
      }

      debounceTimeout = setTimeout(() => {
        fetchCities(normalizedValue);
      }, DEBOUNCE_DELAY);
    },
  );

  onUnmounted(() => {
    clearDebounce();
    abortRequest();
  });

  return {
    ...toRefs(autocompleteState),
    selectCity,
  };
};
