import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import pinia from './pinia'
import './styles.scss'

const app = createApp(App)

app.use(pinia).use(router).mount('#app')
