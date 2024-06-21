import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue'),
	},
	{
		path: '/about',
		name: 'about',
		component: () => import('../views/AboutView.vue'),
	},
	{
		path: '/ddm',
		name: 'ddm',
		component: () => import('../views/DDMView.vue'),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
