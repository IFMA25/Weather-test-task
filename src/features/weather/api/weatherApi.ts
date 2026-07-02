import { CityOptionDto, WeatherDto } from "../types";

import { apiClient } from "@/shared/api/apiClient";

export const searchCities = async (query: string, signal?: AbortSignal) => {
  const { data } = await apiClient.get<CityOptionDto[]>("/geo/1.0/direct", {
    params: {
      q: query,
      limit: 5,
    },
    signal,
  });

  return data;
};

export const getCurrentWeather = async (lat: number, lon: number) => {
  const { data } = await apiClient.get<WeatherDto>("/data/2.5/weather", {
    params: {
      lat,
      lon,
    },
  });

  return data;
};
