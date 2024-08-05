import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/inbox',
		name: 'inbox',
		component: () => import('../../views/InboxView.vue'),
	},
	{
		path: '/materials',
		name: 'materials',
		component: () => import('../../views/MaterialsView.vue'),
	},
	{
		path: '/todos',
		name: 'todos',
		component: () => import('../../views/TodosView.vue'),
	},
	{
		path: '/projects',
		name: 'projects',
		component: () => import('../../views/ProjectsView.vue'),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
