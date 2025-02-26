import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from './auth'

const routes = [
  { path: '/', component: () => import('@/pages/todo'), name: 'todo', meta: { requiresAuth: true } },
  { path: '/?type=note', component: () => import('@/pages/notes'), name: 'notes', meta: { requiresAuth: true } },
  { path: '/?type=project', component: () => import('@/pages/projects'), name: 'projects', meta: { requiresAuth: true } },
  { path: '/register', component: () => import('@/pages/auth/register'), name: 'register' },
  { path: '/login', component: () => import('@/pages/auth/login'), name: 'login' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // loader.show()
    next({ name: 'login' })
  } else {
    // loader.show()
    next()
  }
})

// router.afterEach((to, from) => {
//   loader.hide()
// })
