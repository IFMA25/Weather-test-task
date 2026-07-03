export interface WeatherDto {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface CityOptionDto {
  id: number;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
  favorite?: boolean;
}


export interface WeatherCardItem {
  id: string;
  selectedCity: CityOptionDto | null;
  weather: WeatherDto | null;
  error: string | null;
}

export interface ForecastItemDto {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop?: number;
}

export interface ForecastCityDto {
  id: number;
  name: string;
  country: string;
  sunrise?: number;
  sunset?: number;
  timezone: number;
}

export interface ForecastResponseDto {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItemDto[];
  city: ForecastCityDto;
}

export interface PreparedChartData {
  labels: string[];
  values: number[];
}
