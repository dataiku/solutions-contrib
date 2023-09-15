/**
 * UMD entry-point
 */

import installApp from "./install-lib.js";
import * as components from "./components";
import ServerApi from "./server_api";

export default {
  version: __UI_VERSION__,
  install(app) {
    installApp(app, {
      components,
    });
  },
  ...components,
  ServerApi
};
