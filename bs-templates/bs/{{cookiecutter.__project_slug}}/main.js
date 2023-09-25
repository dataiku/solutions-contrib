import { Quasar, Notify, ClosePopup, QIcon, QMenu, QList, QItemSection, QItem  } from "quasar";
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
import { ServerApi } from "quasar-ui-bs";
import { baseURL } from "./ApiHelper";

ServerApi.init(baseURL);
myApp.config.unwrapInjectedRef = true;

myApp.use(Quasar, {
  plugins: {
    Notify,
  },
  components: {
     QIcon, QMenu, QList, QItemSection, QItem
  },
  directives: {
    ClosePopup
  }
});

myApp.use(QuasarBs);

myApp.mount("#app");
