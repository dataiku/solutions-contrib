import { createApp } from 'vue'
import App from "./src/App.vue"
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'


import 'vite/modulepreload-polyfill'


const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {},
})

myApp.mount('#app')
