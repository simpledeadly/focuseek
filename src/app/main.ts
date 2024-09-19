import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).mount('#app')
