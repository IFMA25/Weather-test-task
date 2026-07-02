export const RouteNames = {
  home: "home",
  favorites: "favorites",
  notFound: "NotFound",
} as const;

export type RouteName = typeof RouteNames[keyof typeof RouteNames];

export const LocalStorageKeys = {
  currentCityCoordinates: "current_city_coord",
  citiesCoordinates: "cities_coords",
  favoritesCitiesCoordinates: "favorites_cities_coords",
} as const;

export type LocalStorageKey = typeof LocalStorageKeys[keyof typeof LocalStorageKeys];
