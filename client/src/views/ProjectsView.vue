<script setup lang="ts">
import { ItemsList } from '@/widgets/items-widget'
</script>

<template>
	<div class="container py-10 mx-auto">
		<h1 class="centered h1">Projects</h1>
		<ItemsList :filter="'project'" />
	</div>
</template>

<style lang="scss" scoped>
.h1 {
	margin-bottom: 1.5rem;
	font-size: 30px;
	font-weight: 900;
	color: #101010;
}
</style>
