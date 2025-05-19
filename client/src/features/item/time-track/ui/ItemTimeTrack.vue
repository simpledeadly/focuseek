<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu'
import { Badge } from '@/shared/ui/badge'
import { Item } from '@/entities/item'
import { Pause, Play } from 'lucide-vue-next'
import { upsertTimerOnServer, fetchTimerFromServer } from '@/shared/api/api'
import { Timer } from '@/entities/timer'
import { toast } from 'vue-sonner'
import { parseDurationToUnixTimestamp, parseUnixTimestampToDuration } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'

const props = defineProps<{
  item: Item
}>()

const emit = defineEmits<{
  (e: 'change-duration-planned', value: number | null): void
  (e: 'change-duration-real', value: number | null): void
  (e: 'reset-timer'): void
  (e: 'remove-timer'): void
}>()

const model = defineModel<boolean>()

const inputValue = ref<string | undefined>()
const startTime = ref<number | null>()
const trackedDuration = ref<number>(0)
const currentTime = ref(Date.now())

let animationFrame: number | null = null

const updateTime = () => {
  currentTime.value = Date.now()
  animationFrame = requestAnimationFrame(updateTime)
}

const isOverdue = ref<boolean>(false)

const remainingTime = computed(() => {
  if (!props.item.durationPlanned) return 0

  const elapsedSinceStart = model.value && startTime.value ? currentTime.value - startTime.value : 0
  const totalTracked = trackedDuration.value + elapsedSinceStart
  const remaining = props.item.durationPlanned - totalTracked
  return remaining > 0 ? remaining : 0
})

const formattedTime = computed(() => {
  if (props.item.durationPlanned && remainingTime.value > 0) {
    return parseUnixTimestampToDuration(remainingTime.value)
  } else {
    const totalMs = model.value
      ? trackedDuration.value + (startTime.value ? currentTime.value - startTime.value : 0)
      : trackedDuration.value || props.item.durationPlanned || 0

    if (model.value || trackedDuration.value > 0) {
      return parseUnixTimestampToDuration(totalMs)
    }
  }
})

watch(remainingTime, (newVal, oldVal) => {
  if (oldVal > 0 && newVal === 0) {
    isOverdue.value = true
  } else {
    isOverdue.value = false
  }
})

const displayTime = computed(() => formattedTime.value)

const displayPlannedTime = computed(() => {
  return props.item.durationPlanned ? parseUnixTimestampToDuration(props.item.durationPlanned) : ''
})

const setTimerState = (data: Partial<Timer>) => {
  startTime.value = data.startTime ?? null
  trackedDuration.value = data.trackedDuration || 0
  model.value = data.isRunning ?? false
  if (data.isRunning && data.startTime) {
    updateTime()
  }
}

const loadTimerStateFromLocalStorage = () => {
  if (props.item.durationReal == null) return false
  const saved = localStorage.getItem(`timer_${props.item.id}`)
  if (saved) {
    const {
      startTime: savedStart,
      trackedDuration: savedDuration,
      isRunning,
      updatedAt,
    } = JSON.parse(saved)
    if (updatedAt && Date.now() - updatedAt > 60 * 60 * 1000) {
      return false
    }
    setTimerState({
      startTime: savedStart,
      trackedDuration: savedDuration,
      isRunning,
    })
    return true
  }
  return false
}

const loadTimerStateFromServer = async () => {
  if (props.item.durationReal == null) return false
  try {
    const data = await fetchTimerFromServer(props.item.id)
    setTimerState(data)
    localStorage.setItem(
      `timer_${props.item.id}`,
      JSON.stringify({
        ...data,
        updatedAt: Date.now(),
      })
    )
    return true
  } catch (error) {
    console.error('Ошибка загрузки состояния таймера:', error)
    toast.error('Ошибка', {
      description: 'Не удалось сохранить состояние таймера на сервере.',
    })
    return false
  }
}

const saveTimerState = async () => {
  const state: Timer = {
    id: Date.now(),
    userId: props.item.userId,
    collectionId: props.item.collectionId,
    itemId: props.item.id,
    startTime: startTime.value,
    trackedDuration: trackedDuration.value,
    isRunning: model.value,
  }
  try {
    await upsertTimerOnServer(props.item.id, state)
    localStorage.setItem(`timer_${props.item.id}`, JSON.stringify(state))
  } catch (error) {
    console.error('Ошибка сохранения состояния таймера:', error)
    localStorage.setItem(`timer_${props.item.id}`, JSON.stringify(state))
    toast.error('Ошибка', {
      description: 'Не удалось сохранить состояние таймера на сервере.',
    })
  }
}

watch(
  () => props.item.durationReal,
  (newVal) => {
    if (newVal === 0 || newVal === null) {
      startTime.value = null
      trackedDuration.value = 0
      model.value = false
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }
)

const toggleTimer = async () => {
  if (model.value) {
    if (startTime.value) {
      trackedDuration.value += Date.now() - startTime.value
      startTime.value = null
    }
    model.value = false
    emit('change-duration-real', trackedDuration.value)
    cancelAnimationFrame(animationFrame!)
    await saveTimerState()
  } else {
    startTime.value = Date.now()
    model.value = true
    updateTime()
    await saveTimerState()
  }
}

const handleChangeDuration = async (durType: string) => {
  if (inputValue.value !== undefined && inputValue.value.length >= 0) {
    if (durType === 'durPlan') {
      emit('change-duration-planned', parseDurationToUnixTimestamp(inputValue.value))
    } else if (durType === 'durReal') {
      const state = {
        id: Date.now(),
        userId: props.item.userId,
        collectionId: props.item.collectionId,
        itemId: props.item.id,
        startTime: null,
        trackedDuration: parseDurationToUnixTimestamp(inputValue.value),
        isRunning: false,
      }
      emit('change-duration-real', parseDurationToUnixTimestamp(inputValue.value))
      await upsertTimerOnServer(props.item.id, state)
      localStorage.setItem(`timer_${props.item.id}`, JSON.stringify(state))
      loadTimerStateFromLocalStorage()
    }
    inputValue.value = ''
  } else {
    console.log('Введите корректное время (в минутах).')
  }
}

const handleRemoveDurationPlanned = () => {
  emit('change-duration-planned', null)
}

onMounted(async () => {
  if (!loadTimerStateFromLocalStorage()) {
    await loadTimerStateFromServer()
  }
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div class="item-duration">
    <ContextMenu>
      <ContextMenuTrigger>
        <Badge
          :variant="model ? 'default' : 'secondary'"
          class="font-normal flex items-center gap-1"
          @click="toggleTimer"
        >
          <Play
            v-if="!model"
            class="w-4 h-4"
          />
          <Pause
            v-else
            class="w-4 h-4"
          />
          <span v-if="displayTime || model">{{ displayTime }}</span>
          <span
            v-if="displayPlannedTime"
            class="text-muted-foreground"
            :class="model && isOverdue ? 'text-red-600' : isOverdue && 'text-red-400'"
          >
            ({{ displayPlannedTime }})
          </span>
        </Badge>
      </ContextMenuTrigger>
      <ContextMenuContent class="w-48">
        <ContextMenuItem @click="handleRemoveDurationPlanned">Remove durPlan</ContextMenuItem>
        <ContextMenuItem @click="emit('reset-timer')">Reset durReal</ContextMenuItem>
        <ContextMenuItem @click="emit('remove-timer')">Remove stopwatch</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Change durPlan</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <Input
              type="text"
              v-model="inputValue"
              placeholder="e.g. 1h 23m 45s"
              @keydown.enter="handleChangeDuration('durPlan')"
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Change durReal</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <Input
              type="text"
              v-model="inputValue"
              placeholder="e.g. 1h 23m 45s"
              @keydown.enter="handleChangeDuration('durReal')"
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>

<style lang="scss">
.item-duration {
  // font-family: $font;
}
</style>
