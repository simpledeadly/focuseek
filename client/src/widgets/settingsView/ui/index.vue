<script setup lang="ts">
import { Button } from '@/shared/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/shared/ui/drawer'
import { useColorMode } from '@vueuse/core'
import { Bolt, Laptop, Lightbulb, Moon } from 'lucide-vue-next'
import { Toggle } from 'radix-vue'

const mode = useColorMode()
</script>

<template>
	<Drawer>
		<DrawerTrigger as-child>
			<Toggle>
				<Bolt />
			</Toggle>
		</DrawerTrigger>
		<DrawerContent>
			<div class="mx-auto w-full max-w-sm">
				<DrawerHeader>
					<DrawerTitle>Theme</DrawerTitle>
					<DrawerDescription>Try out the dark theme.</DrawerDescription>
				</DrawerHeader>
				<div class="p-4 pb-0">
					<div class="flex items-center justify-center space-x-2">
						<Toggle>
							<Lightbulb @click="mode = 'light'" />
						</Toggle>
						<Toggle @click="mode = 'dark'">
							<Moon />
						</Toggle>
						<Toggle @click="mode = 'auto'">
							<Laptop />
						</Toggle>
						<!-- <Toggle>
							<LucideMedal @click="mode = 'lime'" />
						</Toggle> -->
						<!-- <p>*not working theme switcher*</p> -->
					</div>
				</div>
				<DrawerFooter>
					<DrawerClose as-child>
						<Button>OK</Button>
					</DrawerClose>
					<DrawerClose as-child>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</div>
		</DrawerContent>
	</Drawer>
</template>

<style lang="scss"></style>
