import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { getUserLocationByIp } from "@/features/weather/api/geoApi";
import { getCurrentWeather } from "@/features/weather/api/weatherApi";
import type { CityOptionDto, WeatherCardItem } from "@/features/weather/types";
import type { Coordinates } from "@/shared/types/storage";
import {
  setToLocalStorage,
  getFromLocalStorage,
  addCoordinateToLocalStorage,
  removeCoordinateFromLocalStorage,
} from "@/shared/utils/localStorage";
import { LocalStorageKeys } from "@/shared/variables";

const MAX_WEATHER_CARDS = 5;

export const useWeatherFeature = () => {
  const weatherCards = ref<WeatherCardItem[]>([]);
  const isPending = ref(false);

  const { t } = useI18n();

  const createWeatherCard = (
    options: Partial<WeatherCardItem> = {},
  ): WeatherCardItem => ({
    id: crypto.randomUUID(),
    selectedCity: null,
    weather: null,
    isLoading: false,
    error: null,
    ...options,
  });

  const getWeatherByCoordinates = async (coords: Coordinates) => {
    const weather = await getCurrentWeather(coords.lat, coords.lon);

    return {
      weather,
      city: {
        id: weather.id,
        name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      },
      weatherCoords: {
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      },
    };
  };

  const hasCityByWeatherId = (cityId: number) => {
    return weatherCards.value.some((card) => card.selectedCity?.id === cityId);
  };

  const addWeatherCard = async (city: CityOptionDto) => {
    if (weatherCards.value.length >= MAX_WEATHER_CARDS) {
      toast.error(t("weather.maxWeatherCards"));
      return;
    }

    try {
      isPending.value = true;

      const { weather, city: weatherCity, weatherCoords } =
        await getWeatherByCoordinates({
          lat: city.lat,
          lon: city.lon,
        });

      if (hasCityByWeatherId(weatherCity.id)) {
        toast.error(t("weather.cityAlreadyAdded"));
        return;
      }

      weatherCards.value.push(
        createWeatherCard({
          selectedCity: weatherCity,
          weather,
        }),
      );

      addCoordinateToLocalStorage(
        LocalStorageKeys.citiesCoordinates,
        weatherCoords,
      );
    } catch {
      toast.error(t("weather.error"));
    } finally {
      isPending.value = false;
    }
  };

  const removeWeatherCard = (cardId: string) => {
    if (weatherCards.value.length === 1) return;

    const cardToRemove = weatherCards.value.find((card) => card.id === cardId);

    if (cardToRemove?.selectedCity) {
      removeCoordinateFromLocalStorage(
        LocalStorageKeys.citiesCoordinates,
        cardToRemove.selectedCity.lat,
        cardToRemove.selectedCity.lon,
      );
    }

    weatherCards.value = weatherCards.value.filter((card) => card.id !== cardId);
  };

  const getCurrentWeatherCoordinates = async () => {
    const currentCoords = getFromLocalStorage(
      LocalStorageKeys.currentCityCoordinates,
    );

    if (currentCoords) {
      const currentWeather = await getWeatherByCoordinates(currentCoords);

      return {
        currentCoords,
        currentWeather,
      };
    }

    const ipCoords = await getUserLocationByIp();

    const currentWeather = await getWeatherByCoordinates(ipCoords);

    setToLocalStorage(
      LocalStorageKeys.currentCityCoordinates,
      currentWeather.weatherCoords,
    );

    return {
      currentCoords: currentWeather.weatherCoords,
      currentWeather,
    };
  };

  const loadWeatherCards = async () => {
    try {
      isPending.value = true;

      const { currentCoords, currentWeather } =
        await getCurrentWeatherCoordinates();

      const savedCoords: Coordinates[] =
        getFromLocalStorage(LocalStorageKeys.citiesCoordinates) || [];

      const uniqueCoords = savedCoords.filter(
        (coord, index, array) =>
          !(coord.lat === currentCoords.lat && coord.lon === currentCoords.lon) &&
          array.findIndex(
            (item) => item.lat === coord.lat && item.lon === coord.lon,
          ) === index,
      );

      const resolvedList = await Promise.all(
        uniqueCoords.map((coord) => getWeatherByCoordinates(coord)),
      );

      const uniqueWeatherCards = [currentWeather, ...resolvedList].filter(
        (item, index, array) =>
          array.findIndex((x) => x.city.id === item.city.id) === index,
      );

      weatherCards.value = uniqueWeatherCards.map(({ weather, city }) =>
        createWeatherCard({
          selectedCity: city,
          weather,
        }),
      );

      setToLocalStorage(
        LocalStorageKeys.currentCityCoordinates,
        currentCoords,
      );

      setToLocalStorage(
        LocalStorageKeys.citiesCoordinates,
        uniqueWeatherCards
          .slice(1)
          .map((item) => ({
            lat: item.city.lat,
            lon: item.city.lon,
          })),
      );
    } catch {
      toast.error(t("weather.error"));
    } finally {
      isPending.value = false;
    }
  };

  return {
    weatherCards,
    isPending,
    addWeatherCard,
    removeWeatherCard,
    loadWeatherCards,
  };
};
