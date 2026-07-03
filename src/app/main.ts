import { createPinia } from "pinia";
import { createApp } from "vue";
import VueFeather from "vue-feather";

import App from "./App.vue";
import router from "./router/router";

import "./main.scss";
import "vue-multiselect/dist/vue-multiselect.min.css";
import i18n from "@/shared/i18n/index.js";

const app = createApp(App);

app.component(VueFeather.name, VueFeather);

app.use(router);
app.use(createPinia());
app.use(i18n);

router.isReady().then(() => {
  app.mount("#app");
});
