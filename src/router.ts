import { createRouter, createWebHistory } from 'vue-router'
import { AboutView, HomeView, TodoView } from './views'

const routes = [
  { path: '/home', redirect: { name: 'home' } },
  { path: '/', component: HomeView, name: 'home' },
  { path: '/about', component: AboutView, name: 'about' },
  { path: '/todo', component: TodoView, name: 'todo' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
