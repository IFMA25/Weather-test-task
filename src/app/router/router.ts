import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

import FavoritesPage from "@/pages/FavoritesPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import WeatherPage from "@/pages/WeatherPage.vue";
import { RouteNames } from "@/shared/variables";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.home,
    component: WeatherPage,
    meta: {
      titleMenu: "weather",
    },
  },
  {
    path: "/favorites",
    name: RouteNames.favorites,
    component: FavoritesPage,
    meta: {
      titleMenu: "favorites",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: RouteNames.notFound,
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
