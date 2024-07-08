<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ref } from 'vue'

const activeTab = ref(2)

type TabType = {
	id: number
	title: string
	route: string
}

const tabs: TabType[] = [
	// { id: 1, title: 'Overview', route: '/' },
	{ id: 2, title: 'Inbox', route: '/inbox' },
	{ id: 3, title: 'Materials', route: '/materials' },
	{ id: 4, title: 'Tasks', route: '/tasks' },
	{ id: 5, title: 'Projects', route: '/projects' },
	// { id: 6, title: 'Achievements', route: '/achievements' },
	// { id: 7, title: 'TimeTrack', route: '/timetrack' },
]

const setActiveTab = (tabId: number) => {
	activeTab.value = tabId
}
</script>

<template>
	<Tabs :default-value="activeTab" class="w-[400px]">
		<TabsList class="bar">
			<router-link
				v-for="tab in tabs"
				@click="setActiveTab(tab.id)"
				:to="tab.route"
				:key="tab.id"
			>
				<TabsTrigger
					:class="tab.id === activeTab ? 'active' : 'default'"
					:value="tab.title"
				>
					{{ tab.title }}
				</TabsTrigger>
			</router-link>
		</TabsList>
	</Tabs>
</template>

<!-- <style lang="scss" scoped>
.bar {
	background: #e2e6e9;
	border: 1px solid #c3c3c3;
	// margin-bottom: 0rem;
}

.active {
	color: #2f2f2f;
	// font-weight: bolder;
	background: #f5f7f8;
	box-shadow: 0 1px 2px #c3c3c3;
	transition: all 0.3s ease;

	&:active {
		font-weight: bolder;
	}
}

.default {
	color: #3f3f3f;

	&:active {
		background: #f5f7f8;
	}
}
</style> -->
