<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/shared/ui/select'
</script>

<template>
	<Select>
		<SelectTrigger
			class="w-[150px]"
			style="height: 100%; padding: 0.25rem 0.5rem"
		>
			<SelectValue placeholder="Select" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup style="padding: 0">
				<SelectItem value="inbox" class="pd">Inbox</SelectItem>
				<SelectItem value="material" class="pd">Material</SelectItem>
				<SelectItem value="task" class="pd">Task</SelectItem>
				<SelectItem value="project" class="pd">Project</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<style lang="scss">
.pd {
	padding: 0.25rem 0 0.25rem 1.75rem;
}
</style>
