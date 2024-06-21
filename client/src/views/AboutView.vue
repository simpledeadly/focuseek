<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const notes = ref([])

const fetchData = async () => {
	try {
		const response = await axios.get('http://localhost:3000/notes')
		notes.value = response.data
	} catch (error) {
		console.error('Ошибка:', error)
	}
}

fetchData()
</script>

<template>
	<div class="about">
		<h1>Заметки</h1>
		<ul v-for="note in notes" :key="note.id">
			<li>{{ note.content }}</li>
		</ul>
	</div>
</template>
