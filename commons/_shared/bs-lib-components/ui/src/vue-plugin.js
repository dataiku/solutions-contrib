import installApp from "./install-lib";
import ServerApi from "./server_api";
const version = __UI_VERSION__;

export default {
  version: version,
  install: installApp,
  serverApi: ServerApi,
};
