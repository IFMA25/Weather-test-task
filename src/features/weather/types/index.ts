import { CityOptionDto } from "@/shared/types/weather";

export interface CityAutocompleteState {
  query: string;
  cities: CityOptionDto[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

export interface IpGeoResponseDto {
  latitude: number;
  longitude: number;
}

export interface UserGeoLocationDto {
  lon: number;
  lat: number;
  name?: string;
  country?: string;
}
