<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu'
import { Calendar } from '@/shared/ui/calendar'
import type { DateValue } from '@internationalized/date'

const emit = defineEmits<{
  (e: 'remove'): void
}>()

const props = defineProps<{
  label: string
  value?: number
}>()

const model = defineModel<DateValue | undefined>()
</script>

<template>
  <DropdownMenuSub v-if="!props.value">
    <DropdownMenuSubTrigger>
      <span>Set {{ props.label }}</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <Calendar v-model="model" />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
  <DropdownMenuItem
    v-else
    @click="emit('remove')"
  >
    <span>Remove {{ props.label }}</span>
  </DropdownMenuItem>
</template>
