import { createRouter, createWebHistory } from 'vue-router'
import { InboxView, MaterialsView, ProjectsView, TodosView } from '../views'

const routes = [
  { path: '/home', redirect: { name: 'inbox' } },
  { path: '/', component: InboxView, name: 'inbox' },
  { path: '/materials', component: MaterialsView, name: 'materials' },
  { path: '/todos', component: TodosView, name: 'todos' },
  { path: '/projects', component: ProjectsView, name: 'projects' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
