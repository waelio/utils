import { createApp } from "vue";
import {
  Dark,
  Dialog,
  Loading,
  LoadingBar,
  Notify,
  QSpinnerGears,
  Quasar,
} from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.css";
import App from "./App.vue";
import { configureNote } from "@waelio/utils/note";

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    LoadingBar,
  },
});

configureNote({
  Notify,
  Dialog,
  Loading,
  LoadingBar,
  Dark,
  QSpinnerGears,
});

app.mount("#app");
