import installApp from "./install-lib.js";

import * as components from "./components.js";

export const QuasarBs = {
  version: __UI_VERSION__,
  install(app) {
    installApp(app, { components });
  },
};

export * from "./components.js";
export const version = __UI_VERSION__;
