import { createApp } from 'vue'
import App from "./App.vue"


export const myApp = createApp(App)

/* Add custom plugins needed for the app except for Quasar and QuasarBS (like router / store ...) --> synthax myApp.use(plugin) */