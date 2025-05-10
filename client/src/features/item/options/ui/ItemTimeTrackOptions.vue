<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

const emit = defineEmits<{
  (e: 'reset-timer'): void
  (e: 'remove-timer'): void
  (e: 'remove-durationPlanned'): void
  (e: 'change-duration', value?: string): void
}>()

const props = defineProps<{
  durPlan?: number | null
  durReal?: number | null
}>()

const inputValue = defineModel<string>()
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <span>{{ !props.durPlan ? 'Set duration' : 'Change duration' }}</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <Input
          type="text"
          v-model="inputValue"
          placeholder="e.g. 1h 23m 45s"
          @keydown.enter="emit('change-duration', inputValue)"
        />
        <Button
          variant="outline"
          class="mt-1 w-full"
          @click="emit('remove-durationPlanned')"
          :disabled="!props.durPlan"
          >Remove</Button
        >
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
  <DropdownMenuItem
    @click="emit('reset-timer')"
    :disabled="props.durReal === 0 || (props.durReal === null && !!props.durPlan)"
  >
    <span>{{
      props.durReal === null && !props.durPlan ? 'Add stopwatch' : 'Reset stopwatch'
    }}</span>
    <DropdownMenuShortcut>{{ props.durReal === null ? 'E' : '⇧E' }}</DropdownMenuShortcut>
  </DropdownMenuItem>
  <DropdownMenuItem
    v-if="props.durReal !== null || props.durPlan"
    @click="emit('remove-timer')"
  >
    <span>Remove stopwatch</span>
    <DropdownMenuShortcut>E</DropdownMenuShortcut>
  </DropdownMenuItem>
</template>
