import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/home'), name: 'home' },
  { path: '/?type=note', component: () => import('@/pages/notes'), name: 'notes' },
  { path: '/?type=project', component: () => import('@/pages/projects'), name: 'projects' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
