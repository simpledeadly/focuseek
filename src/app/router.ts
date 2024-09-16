import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/home'), name: 'home' },
  { path: '/?type=material', component: () => import('@/pages/materials'), name: 'materials' },
  { path: '/?type=project', component: () => import('@/pages/projects'), name: 'projects' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
