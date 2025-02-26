import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './styles.scss'

const pinia = createPinia()
pinia.use(persist)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
