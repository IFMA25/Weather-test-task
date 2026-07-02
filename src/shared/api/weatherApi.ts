import { apiClient } from "./apiClient";

export const searchCities = async (query: string) => {
  const { data } = await apiClient.get("/geo/1.0/direct", {
    params: {
      q: query,
      limit: 5,
    },
  });

  return data;
};

export const getCurrentWeather = async (lat: number, lon: number, lang = "en") => {
  const { data } = await apiClient.get("/data/2.5/weather", {
    params: {
      lat,
      lon,
      lang,
    },
  });

  return data;
};

export const getForecast5Days = async (lat: number, lon: number, lang = "en") => {
  const { data } = await apiClient.get("/data/2.5/forecast", {
    params: {
      lat,
      lon,
      lang,
    },
  });

  return data;
};
