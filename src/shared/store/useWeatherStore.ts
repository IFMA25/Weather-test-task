import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { getUserLocationByIp } from "@/features/weather/api/geoApi";
import { getCurrentWeather } from "@/features/weather/api/weatherApi";
import type { Coordinates, FavoriteCity } from "@/shared/types/storage";
import type { CityOptionDto, WeatherCardItem } from "@/shared/types/weather";
import {
  setToLocalStorage,
  getFromLocalStorage,
  addCoordinateToLocalStorage,
  removeCoordinateFromLocalStorage,
} from "@/shared/utils/localStorage";
import { LocalStorageKeys } from "@/shared/variables";

const MAX_WEATHER_CARDS = 5;

export const useWeatherStore = defineStore("weather", () => {
  const weatherCards = ref<WeatherCardItem[]>([]);
  const favoriteWeatherCards = ref<WeatherCardItem[]>([]);
  const favoriteCities = ref<FavoriteCity[]>([]);
  const isPending = ref(false);
  const isPendingFavorites = ref(false);

  const { t } = useI18n();

  const createWeatherCard = (
    options: Partial<WeatherCardItem> = {},
  ): WeatherCardItem => ({
    id: crypto.randomUUID(),
    selectedCity: null,
    weather: null,
    error: null,
    ...options,
  });

  const loadFavoriteCities = () => {
    favoriteCities.value =
      getFromLocalStorage<FavoriteCity[]>(
        LocalStorageKeys.favoritesCitiesCoordinates,
      ) || [];
  };

  const isFavoriteCity = (cityId: number | string) => {
    return favoriteCities.value.some((city) => city.cityId === cityId);
  };

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
        favorite: isFavoriteCity(weather.id),
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

  const hasFavoriteWeatherCard = (cityId: number) => {
    return favoriteWeatherCards.value.some((card) => card.selectedCity?.id === cityId);
  };

  const loadFavoriteWeatherCards = async () => {
    isPendingFavorites.value = true;
    try {
      loadFavoriteCities();

      if (!favoriteCities.value.length) {
        favoriteWeatherCards.value = [];
        return;
      }

      const resolvedFavorites = await Promise.all(
        favoriteCities.value.map((favorite) =>
          getWeatherByCoordinates(favorite.coordinates),
        ),
      );

      const uniqueFavoriteCards = resolvedFavorites.filter(
        (item, index, array) =>
          array.findIndex((x) => x.city.id === item.city.id) === index,
      );

      favoriteWeatherCards.value = uniqueFavoriteCards.map(({ weather, city }) =>
        createWeatherCard({
          selectedCity: {
            ...city,
            favorite: true,
          },
          weather,
        }),
      );
    } catch {
      toast.error(t("weather.error"));
    } finally {
      isPendingFavorites.value = false;
    }
  };

  const addFavoriteWeatherCard = async (coords: Coordinates) => {
    const { weather, city } = await getWeatherByCoordinates(coords);

    if (hasFavoriteWeatherCard(city.id)) return;

    favoriteWeatherCards.value.push(
      createWeatherCard({
        selectedCity: {
          ...city,
          favorite: true,
        },
        weather,
      }),
    );
  };

  const toggleFavorite = async (
    cityId: number,
    coords: Coordinates,
    checked: boolean,
  ) => {
    if (checked) {
      if (!isFavoriteCity(cityId) && favoriteCities.value.length >= MAX_WEATHER_CARDS) {
        return { success: false, reason: "card-limit" };
      }

      if (!isFavoriteCity(cityId)) {
        favoriteCities.value.push({ cityId, coordinates: coords });
      }
    } else {
      favoriteCities.value = favoriteCities.value.filter(
        (city) => city.cityId !== cityId,
      );
    }

    weatherCards.value = weatherCards.value.map((card) => {
      if (!card.selectedCity || card.selectedCity.id !== cityId) {
        return card;
      }

      return {
        ...card,
        selectedCity: {
          ...card.selectedCity,
          favorite: checked,
        },
      };
    });

    if (checked) {
      await addFavoriteWeatherCard(coords);
    } else {
      favoriteWeatherCards.value = favoriteWeatherCards.value.filter(
        (card) => card.selectedCity?.id !== cityId,
      );
    }

    setToLocalStorage(
      LocalStorageKeys.favoritesCitiesCoordinates,
      favoriteCities.value,
    );

    return { success: true };
  };

  const addWeatherCard = async (city: CityOptionDto) => {
    if (weatherCards.value.length >= MAX_WEATHER_CARDS) {
      return { success: false, reason: "card-limit" };
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

      return { success: true };
    } catch {
      toast.error(t("weather.error"));
      return { success: false, reason: "weather-error" };
    } finally {
      isPending.value = false;
    }
  };

  const removeWeatherCard = (cardId: string) => {
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

  const removeFavoriteCity = (cityId: number) => {
    favoriteCities.value = favoriteCities.value.filter(
      (city) => city.cityId !== cityId,
    );

    favoriteWeatherCards.value = favoriteWeatherCards.value.filter(
      (card) => card.selectedCity?.id !== cityId,
    );

    weatherCards.value = weatherCards.value.map((card) => {
      if (!card.selectedCity || card.selectedCity.id !== cityId) {
        return card;
      }

      return {
        ...card,
        selectedCity: {
          ...card.selectedCity,
          favorite: false,
        },
      };
    });

    setToLocalStorage(
      LocalStorageKeys.favoritesCitiesCoordinates,
      favoriteCities.value,
    );
  };

  const getCurrentWeatherCoordinates = async () => {
    const currentCoords = getFromLocalStorage<Coordinates>(
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

      loadFavoriteCities();

      const { currentCoords, currentWeather } =
        await getCurrentWeatherCoordinates();

      const savedCoords: Coordinates[] =
        getFromLocalStorage<Coordinates[]>(LocalStorageKeys.citiesCoordinates) || [];

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
        uniqueWeatherCards.slice(1).map((item) => ({
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
    favoriteWeatherCards,
    isPending,
    favoriteCities,
    removeFavoriteCity,
    addWeatherCard,
    removeWeatherCard,
    loadWeatherCards,
    loadFavoriteWeatherCards,
    toggleFavorite,
    isFavoriteCity,
  };
});
