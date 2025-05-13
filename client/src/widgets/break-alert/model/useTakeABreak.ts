import { ref, watch, onScopeDispose, computed, onUnmounted, onMounted, onBeforeUnmount } from 'vue'
import {
  formatDateToYMD,
  parseDurationToUnixTimestamp,
  parseUnixTimestampToDuration,
  updateLocalStorageField,
} from '@/shared/lib/utils'

export const useTakeABreak = () => {
  const storedValue = localStorage.getItem('breaks')
  const storedProgress = localStorage.getItem('breakProgress')
  const storedElapsed = localStorage.getItem('elapsedBreak')
  const storedPrevBreak = localStorage.getItem('prevBreakEnded')
  const storedElapsedUpdate = localStorage.getItem('elapsedBreakUpdate')
  const storedLastBreakTimestamp = localStorage.getItem('lastBreakTimestamp')

  const now = ref(Date.now())

  const takeABreakReminders = ref<boolean>(storedValue ? JSON.parse(storedValue).isBreaks : false)
  const isBreakTracking = ref<boolean>(false)
  const canCloseAlert = ref<boolean>(false)
  const isBreakNow = ref<boolean>(false)
  const newBreakStarted = ref<boolean>(false)
  const breakPer = ref<string>(
    storedValue ? parseUnixTimestampToDuration(JSON.parse(storedValue).everyMs) : '30m'
  )
  const breakFor = ref<string>(
    storedValue ? parseUnixTimestampToDuration(JSON.parse(storedValue).forMs) : '1m 30s'
  )
  const breakEveryMillis = computed<number>(() => parseDurationToUnixTimestamp(breakPer.value))
  const breakForMillis = computed<number>(() => parseDurationToUnixTimestamp(breakFor.value))
  const seconds = ref<number>(0)

  let nowTimer: ReturnType<typeof setInterval> | null = null
  let intervalId: ReturnType<typeof setTimeout> | null = null
  let timerUpdateId: ReturnType<typeof setInterval> | null = null
  let timerId: ReturnType<typeof setInterval> | null = null

  // Время последнего срабатывания перерыва (timestamp в мс)
  const lastBreakTimestamp = ref<number | null>(
    storedLastBreakTimestamp ? Number(JSON.parse(storedLastBreakTimestamp)) : null
  )
  const lastBreakTimestampWas = ref<number | null>(
    storedPrevBreak ? Number(JSON.parse(storedPrevBreak)) : null
  )
  const lastBreak = computed<string | undefined>(() => {
    if (storedPrevBreak) {
      return formatDateToYMD(new Date(JSON.parse(storedPrevBreak)), true)
    }
  })

  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue)
      breakFor.value = parseUnixTimestampToDuration(parsed.forMs) ?? '60s'
    } catch {}
  }

  if (storedProgress) {
    try {
      const parsed = JSON.parse(storedProgress)
      isBreakTracking.value = parsed.isBreakTracking ?? false
      isBreakNow.value = parsed.isBreakNow ?? false
      newBreakStarted.value = parsed.newBreakStarted ?? false
      seconds.value = parsed.seconds ?? 0
      canCloseAlert.value = parsed.seconds >= 5
      lastBreakTimestamp.value = parsed.lastBreakTimestamp ?? lastBreakTimestamp.value
    } catch {}
  }

  onMounted(() => {
    if (isBreakTracking.value) {
      startTimer()
    }
    nowTimer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  // Время, прошедшее с последнего перерыва (в мс)
  const elapsedSinceLastBreak = ref<number>(0)
  const lastElapsedUpdate = ref<number | null>(null)

  // --- ВОССТАНОВЛЕНИЕ ПРОШЕДШЕГО ВРЕМЕНИ ---
  if (lastBreakTimestamp.value) {
    if (storedElapsed && storedElapsedUpdate) {
      const elapsed = Number(JSON.parse(storedElapsed))
      const updateTime = Number(JSON.parse(storedElapsedUpdate))
      // Считаем сколько прошло времени с момента последнего сохранения
      elapsedSinceLastBreak.value = elapsed + (now.value - updateTime)
      lastElapsedUpdate.value = now.value
    } else {
      // Если нет сохранённых данных, просто считаем от lastBreakTimestamp
      elapsedSinceLastBreak.value = now.value - lastBreakTimestamp.value
      lastElapsedUpdate.value = now.value
    }
  } else {
    elapsedSinceLastBreak.value = 0
    lastElapsedUpdate.value = null
  }

  // Время, оставшееся до следующего перерыва (в мс)
  const remainingUntilNextBreak = computed(() => {
    if (!lastBreakTimestamp.value) return breakEveryMillis.value
    // добавь зависимость от now.value!
    return Math.max(breakEveryMillis.value - (now.value - lastBreakTimestamp.value), 0)
  })

  const clearExistingInterval = () => {
    if (intervalId !== null) {
      clearTimeout(intervalId)
      intervalId = null
    }
    if (timerUpdateId !== null) {
      clearInterval(timerUpdateId)
      timerUpdateId = null
    }
  }

  const startInterval = () => {
    if (!takeABreakReminders.value) {
      clearExistingInterval()
      return
    }

    clearExistingInterval()

    if (!lastBreakTimestamp.value) {
      lastBreakTimestamp.value = now.value
      localStorage.setItem('lastBreakTimestamp', JSON.stringify(lastBreakTimestamp.value))
    }

    intervalId = setTimeout(() => {
      isBreakNow.value = true
      if (takeABreakReminders.value) {
        updateLocalStorageField('breakProgress', 'isBreakNow', 'true')
      }
      clearExistingInterval()
      console.log('[Break] Время перерыва наступило!')
    }, remainingUntilNextBreak.value)

    timerUpdateId = setInterval(() => {
      if (lastBreakTimestamp.value) {
        elapsedSinceLastBreak.value = now.value - lastBreakTimestamp.value
        localStorage.setItem('elapsedBreak', JSON.stringify(elapsedSinceLastBreak.value))
        localStorage.setItem('lastBreakTimestamp', JSON.stringify(lastBreakTimestamp.value))
      }
    }, 1000)
  }

  interface BreakProgress {
    isBreakTracking: boolean
    isBreakNow: boolean
    newBreakStarted: boolean
    seconds: number
    lastBreakTimestamp: number | null
  }

  const saveBreakProgress = async () => {
    if (!takeABreakReminders.value) return

    const state: BreakProgress = {
      isBreakTracking: isBreakTracking.value,
      isBreakNow: isBreakNow.value,
      newBreakStarted: newBreakStarted.value,
      seconds: seconds.value,
      lastBreakTimestamp: lastBreakTimestamp.value,
    }

    try {
      localStorage.setItem('breakProgress', JSON.stringify(state))
    } catch (error) {
      localStorage.setItem('breakProgress', JSON.stringify(state))
    }
  }

  watch(isBreakNow, (newVal, oldVal) => {
    if (oldVal === true && newVal === false && takeABreakReminders.value) {
      startInterval()
    }
  })

  if (takeABreakReminders.value) {
    startInterval()
  }

  const resetData = () => {
    isBreakNow.value = false
    elapsedSinceLastBreak.value = 0
    seconds.value = 0
    canCloseAlert.value = false
    lastBreakTimestamp.value = null
    localStorage.removeItem('lastBreakTimestamp')
    localStorage.removeItem('elapsedBreak')
    localStorage.removeItem('elapsedBreakUpdate')
    localStorage.removeItem('breakProgress')
    localStorage.removeItem('seconds')
  }

  // Следим за изменениями флага
  watch(takeABreakReminders, (newVal) => {
    localStorage.setItem(
      'breaks',
      JSON.stringify({
        isBreaks: newVal,
        everyMs: breakEveryMillis.value,
        forMs: breakForMillis.value,
      })
    )

    if (newVal) {
      startInterval()
    } else {
      clearExistingInterval()
      resetData()
      localStorage.removeItem('breaks')
    }
  })

  onScopeDispose(() => {
    clearExistingInterval()
  })

  const formattedTime = computed(() => {
    const m = Math.floor(seconds.value / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  const displayTime = computed(() => formattedTime.value)

  const startTimer = () => {
    if (timerId) return
    if (!newBreakStarted.value) {
      newBreakStarted.value = true
    }
    saveBreakProgress()

    timerId = setInterval(() => {
      seconds.value++
      if (takeABreakReminders.value) {
        updateLocalStorageField('breakProgress', 'seconds', seconds.value.toString())
      }
      if (seconds.value >= breakForMillis.value / 1000) {
        canCloseAlert.value = true
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
    isBreakTracking.value = false
    saveBreakProgress()
  }

  const resetTimer = () => {
    stopTimer()
    seconds.value = 0
    canCloseAlert.value = false
  }

  const onCloseAlert = () => {
    newBreakStarted.value = false
    lastBreakTimestampWas.value = now.value
    localStorage.setItem('prevBreakEnded', JSON.stringify(lastBreakTimestampWas.value))
    resetData()
    stopTimer()
    resetTimer()
    saveBreakProgress()
  }

  watch(isBreakTracking, (newVal) => {
    if (newVal) {
      startTimer()
    } else {
      stopTimer()
    }
  })

  const saveElapsed = () => {
    localStorage.setItem('elapsedBreak', JSON.stringify(elapsedSinceLastBreak.value))
    localStorage.setItem('elapsedBreakUpdate', JSON.stringify(now.value))
  }

  window.addEventListener('beforeunload', saveElapsed)

  onUnmounted(() => {
    stopTimer()
    if (nowTimer) clearInterval(nowTimer)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', saveElapsed)
  })

  const hoursAgo = computed(() =>
    Math.floor((now.value - (lastBreakTimestampWas.value ?? 0)) / (1000 * 60 * 60))
  )
  const minutesAgo = computed(() =>
    Math.floor((now.value - (lastBreakTimestampWas.value ?? 0)) / (1000 * 60))
  )
  const secondsAgo = computed(() =>
    Math.floor((now.value - (lastBreakTimestampWas.value ?? 0)) / 1000)
  )

  const displayTimeTitle = computed(() => {
    if (hoursAgo.value > 1) {
      return `${hoursAgo.value} часов`
    } else if (hoursAgo.value === 1) {
      return `часа`
    } else if (minutesAgo.value > 1) {
      return `${minutesAgo.value} минут`
    } else {
      return `${secondsAgo.value}с`
    }
  })

  return {
    now,
    canCloseAlert,
    onCloseAlert,
    lastBreak,
    newBreakStarted,
    displayTime,
    displayTimeTitle,
    isBreakTracking,
    isBreakNow,
    breakPer,
    breakFor,
    breakEveryMillis,
    lastBreakTimestampWas,
    takeABreakReminders,
    elapsedSinceLastBreak,
    remainingUntilNextBreak,
    confirmBreak: () => {
      isBreakNow.value = false
      lastBreakTimestamp.value = now.value // Обновляем время после подтверждения
      elapsedSinceLastBreak.value = 0
      localStorage.setItem('lastBreakTimestamp', JSON.stringify(lastBreakTimestamp.value))
      saveBreakProgress()
    },
  }
}
