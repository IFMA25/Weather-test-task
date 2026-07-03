import { apiClient } from "./apiClient";
import { ForecastResponseDto } from "../types/weather";

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

export const getWeatherForecast = async (lat: number, lon: number) => {
  const { data } = await apiClient.get<ForecastResponseDto>("/data/2.5/forecast", {
    params: {
      lat,
      lon,
    },
  });

  return data;
};
