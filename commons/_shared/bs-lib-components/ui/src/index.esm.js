
import installApp from "./install-lib";

import * as components from "./components";

export const QuasarBs = {
    version: __UI_VERSION__,
    install (app) {
        installApp(
        app,
        { components },
        )
    }
}

export * from "./components"
