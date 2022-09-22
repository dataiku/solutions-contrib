import { createApp } from 'vue'
import App from './components/App.vue'
import AppSecond from "./components/AppSecond.vue"

import 'vite/modulepreload-polyfill'


createApp(App).mount('#app')

createApp(AppSecond).mount('#appsecond')

