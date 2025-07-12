import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router/router'
import persist from 'pinia-plugin-persistedstate'
import './styles/styles.scss'
import './styles/app.scss'

const pinia = createPinia()
pinia.use(persist)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
