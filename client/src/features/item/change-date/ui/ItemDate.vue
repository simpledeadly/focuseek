<script setup lang="ts">
import { Badge } from '@/shared/ui/badge'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

const props = defineProps<{
  date?: number
}>()

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const dateInput = ref<number>(props.date || 0)

const intervalId = ref<NodeJS.Timeout>()
const targetDate = ref<Date>(new Date())

const dateText = ref<string>('loading...')
const timeLeft = ref<string>('Date will be here')

watch(dateInput, (newValue) => {
  try {
    const parsedDate = new Date(newValue)
    if (!isNaN(parsedDate.getTime())) {
      targetDate.value = parsedDate
    }
  } catch (e) {
    console.error('Error parsing date:', e)
  }
})

onMounted(() => {
  if (props.date) {
    try {
      targetDate.value = new Date(props.date)
    } catch (e) {
      console.error('Error parsing initial date:', e)
    }
  }

  intervalId.value = setInterval(() => {
    const now = new Date()
    const diff = targetDate.value.getTime() - now.getTime()

    if (!props.date) {
      dateText.value = 'Add DL'
      return
    }

    const minutesAll = Math.floor(diff / (1000 * 60))

    if (diff < 0) {
      dateText.value = 'Expired 😵: ' + minutesAll * -1 + 'm'
    } else {
      dateText.value = `${minutesAll}m`

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      timeLeft.value = `Remained ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    }
  }, 100)
})

onUnmounted(() => {
  clearInterval(intervalId.value)
})

const handleSave = () => {
  emit('change', dateInput.value)
}

const handleBadgeVariant = () => {
  if (!props.date) {
    return 'outline'
  } else if (
    parseInt(dateText.value.replace(/\D+/g, '')) <= 960 &&
    !dateText.value.includes('Expired')
  ) {
    return 'destructive'
  } else {
    return 'secondary'
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Badge
        :variant="handleBadgeVariant()"
        class="item-date"
        :title="timeLeft"
      >
        {{ dateText }}
      </Badge>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-2 space-y-2">
      <Input
        v-model="dateInput"
        placeholder="YYYY-M-DD HH:mm"
      />
      <Button @click="handleSave">Save</Button>
    </PopoverContent>
  </Popover>
</template>

<style lang="scss">
.item-date {
  display: flex;
  cursor: pointer;
}
</style>
