import { Quasar, Notify } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-round/material-icons-round.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";
import "quasar/src/css/index.sass";
import "quasar-ui-bs/dist/style.css";
import "./fonts/fonts.scss";
import "vite/modulepreload-polyfill";
import { QuasarBs } from "quasar-ui-bs";
import { myApp } from "./src/index";

myApp.config.unwrapInjectedRef = true;

myApp.use(Quasar, {
  plugins: {
    Notify,
  },
});

myApp.use(QuasarBs);

myApp.mount("#app");
