
/**
 * UMD entry-point
 */

import installApp from './install-lib.js' 
import * as components from './components'

export default {
  version: __UI_VERSION__,
  install (app) {
    installApp(app, {
      components,
    })
  },
  ...components,
}
 