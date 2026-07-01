import { createPinia } from "pinia";
import { createApp } from "vue";
import VueFeather from "vue-feather";

import App from "./App.vue";
import router from "./router/router";
import "./main.scss";

const app = createApp(App);

app.component(VueFeather.name, VueFeather);

app.use(router);
app.use(createPinia());

router.isReady().then(() => {
  app.mount("#app");
});
