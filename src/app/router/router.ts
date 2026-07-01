import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import FavoritesPage from "@/pages/FavoritesPage.vue";
import WeatherPage from "@/pages/WeatherPage.vue";
import { RouteNames } from "@/shared/variables";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.home,
    component: WeatherPage,
    meta: {
      titleMenu: "weather",
      iconMenu: "thermometer",
    },
  },
  {
    path: "/favorites",
    name: RouteNames.favorites,
    component: FavoritesPage,
    meta: {
      titleMenu: "favorites",
      iconMenu: "heart",
    },
  },
  {
    path: "/:path",
    name: RouteNames.notFound,
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
