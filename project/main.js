import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import 'quasar-ui-bs/src/index.sass'
import './fonts/fonts.scss'
import 'vite/modulepreload-polyfill'
import { QuasarBs } from 'quasar-ui-bs'
import { myApp } from './src/index'


myApp.use(Quasar, {
    plugins: {},
})

myApp.use(QuasarBs)


myApp.mount('#app')
