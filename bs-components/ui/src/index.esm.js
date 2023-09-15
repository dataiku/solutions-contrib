import installApp from "./install-lib.js";
import ServerApi from "./server_api.ts";

import * as components from "./components.js";

export const QuasarBs = {
  version: __UI_VERSION__,
  install(app) {
    installApp(app, { components });
  },
};

export * from "./components.js";
export const version = __UI_VERSION__;
export { ServerApi };
