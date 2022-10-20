import { boot } from 'quasar/wrappers'
import { QuasarBs } from 'ui' // "ui" is aliased in quasar.conf.js

export default boot(({ app }) => {
  app.use(QuasarBs)
})