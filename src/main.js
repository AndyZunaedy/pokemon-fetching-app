import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
