<template>
	<div>
		<h2>Achievements</h2>
		<p v-if="achievements.length > 0">Achievements:</p>
		<ul>
			<li v-for="achievement in achievements" :key="achievement.id">
				{{ achievement.quote }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Achievement {
	id: number
	quote: string
}

export default defineComponent({
	name: 'AchievementsPage',
	props: {
		achievements: {
			type: Array as PropType<Achievement[]>,
			required: true,
		},
	},
})
</script>

<style lang="scss" scoped>
// Стили для страницы Achievements
</style>
