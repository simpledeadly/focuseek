<script setup lang="ts">
import { Item } from '@/../../common/types/types'
import { useItemsStore } from '@/app/store/store'
import { ref, watch } from 'vue'

const props = defineProps<{ item: Item }>()

const store = useItemsStore()
const selectedType = ref(props.item.type)

const changeType = () => {
	store.changeItemType(props.item.id, selectedType.value)
}

watch(
	() => props.item.type,
	newType => {
		selectedType.value = newType
	}
)
</script>

<template>
	<div class="border rounded-md">
		<p>{{ item.description }}</p>
		<select v-model="selectedType" @change="changeType">
			<option value="inbox">Inbox</option>
			<option value="material">Material</option>
			<option value="todo">Todo</option>
			<option value="project">Project</option>
		</select>
		<input
			type="checkbox"
			v-if="item.isDone !== undefined"
			v-model="item.isDone"
		/>
	</div>
</template>
