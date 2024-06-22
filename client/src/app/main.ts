import { createApp } from 'vue'
import '../../client/src/registerServiceWorker'
import '../assets/styles/global.scss'
import App from './App.vue'
import router from './router'
import { pinia } from './store'

createApp(App).use(pinia).use(router).mount('#app')
