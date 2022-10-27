import { createApp } from 'vue'
import App from "./src/App.vue"
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import 'quasar-ui-bs/src/index.sass'


import 'vite/modulepreload-polyfill'
import { QuasarBs } from 'quasar-ui-bs'

const myApp = createApp(App)


myApp.use(Quasar, {
    plugins: {},
})

myApp.use(QuasarBs)

myApp.mount('#app')