import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: () => import('../../views/HomeView.vue'),
	},
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
		path: '/tasks',
		name: 'tasks',
		component: () => import('../../views/TasksView.vue'),
	},
	{
		path: '/projects',
		name: 'projects',
		component: () => import('../../views/ProjectsView.vue'),
	},
	{
		path: '/achievements',
		name: 'achievements',
		component: () => import('../../views/AchievementsView.vue'),
	},
	{
		path: '/timetrack',
		name: 'timetrack',
		component: () => import('../../views/TimeTrackView.vue'),
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
