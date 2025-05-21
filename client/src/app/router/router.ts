import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../auth/auth'

const routes = [
  {
    path: '/register',
    component: () => import('@/pages/auth/register'),
    name: 'register',
    title: 'Регистрация',
  },
  { path: '/login', component: () => import('@/pages/auth/login'), name: 'login', title: 'Вход' },
  {
    path: '/collections',
    component: () => import('@/pages/collections'),
    name: 'collections',
    meta: { requiresAuth: true, title: 'Коллекции' },
  },
  {
    path: '/today',
    component: () => import('@/pages/today'),
    name: 'today',
    meta: { requiresAuth: true, title: 'Сегодня' },
  },
  {
    path: '/:collection',
    component: () => import('@/pages/list'),
    name: 'list',
    meta: { requiresAuth: true, title: 'Список' },
    
  },
  // {
  //   path: '/:collection/:item',
  //   component: () => import('@/pages/item'),
  //   name: 'item',
  //   meta: { requiresAuth: true, title: 'Элемент' },
  // },
  {
    path: '/profile',
    component: () => import('@/pages/profile'),
    name: 'profile',
    meta: { requiresAuth: true, title: 'Профиль' },
  },
  {
    path: '/settings',
    component: () => import('@/pages/settings'),
    name: 'settings',
    meta: { requiresAuth: true, title: 'Настройки' },
  },
  { path: '/404', component: () => import('@/pages/not-found'), name: '404', title: '404' },
  { path: '/:catchAll(.*)', redirect: { name: '404' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} | Focuseek` || 'Focuseek'

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else if (to.params.collection === undefined && (to.name === 'todos' || to.name === 'notes')) {
    next({ name: '404' })
  } else {
    next()
  }
})
