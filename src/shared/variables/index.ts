export const RouteNames = {
  home: "home",
  favorites: "favorites",
  notFound: "NotFound",
} as const;

export type RouteName = typeof RouteNames[keyof typeof RouteNames];
