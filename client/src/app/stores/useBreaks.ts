import { ref, watch, onScopeDispose, computed, onUnmounted, onMounted } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { formatDateToYMD, parseDurationToUnixTimestamp } from '@/shared/lib/utils'

export const useBreaksStore = defineStore(
  'breaks',
  () => {
    const now = ref(Date.now())
    const takeABreakReminders = ref<boolean>(false)
    const isBreakTracking = ref<boolean>(false)
    const canCloseAlert = ref<boolean>(false)
    const isBreakNow = ref<boolean>(false)
    const newBreakStarted = ref<boolean>(false)
    const breakPer = ref<string>('30m')
    const breakFor = ref<string>('1m 30s')
    const breakEveryMillis = computed<number>(() => parseDurationToUnixTimestamp(breakPer.value))
    const breakForMillis = computed<number>(() => parseDurationToUnixTimestamp(breakFor.value))
    const seconds = ref<number>(0)

    let nowTimer: ReturnType<typeof setInterval> | null = null
    let intervalId: ReturnType<typeof setTimeout> | null = null
    let timerUpdateId: ReturnType<typeof setInterval> | null = null
    let timerId: ReturnType<typeof setInterval> | null = null

    const lastBreakTimestamp = ref<number | null>(null)
    const lastBreakTimestampWas = ref<number | null>(null)
    const lastBreak = computed<string | undefined>(() => {
      if (lastBreakTimestampWas.value) {
        return formatDateToYMD(new Date(lastBreakTimestampWas.value), true)
      }
    })

    const elapsedSinceLastBreak = ref<number>(0)
    const lastElapsedUpdate = ref<number | null>(null)

    watch(
      [lastBreakTimestamp, now],
      ([ts, n]) => {
        if (ts) {
          elapsedSinceLastBreak.value = n - ts
          lastElapsedUpdate.value = n
        } else {
          elapsedSinceLastBreak.value = 0
          lastElapsedUpdate.value = null
        }
      },
      { immediate: true }
    )

    const remainingUntilNextBreak = computed(() => {
      if (!lastBreakTimestamp.value) return breakEveryMillis.value
      return Math.max(breakEveryMillis.value - (now.value - lastBreakTimestamp.value), 0)
    })

    const clearExistingInterval = () => {
      if (intervalId) {
        clearTimeout(intervalId)
        intervalId = null
      }
      if (timerUpdateId) {
        clearInterval(timerUpdateId)
        timerUpdateId = null
      }
    }

    let audio: HTMLAudioElement | null = null

    const playBreakSound = () => {
      audio = new Audio('/sounds/bell.mp3')
      audio.loop = true
      audio.play().catch((e) => {
        console.log('Не удалось воспроизвести звук:', e)
      })
    }

    const stopLoopSound = () => {
      if (!audio) return
      audio.loop = false
      audio.addEventListener(
        'ended',
        () => {
          audio?.pause()
          audio = null
          console.log('Звук остановлен после доигрывания')
        },
        { once: true }
      )
    }

    const showBreakNotification = () => {
      console.log('showBreakNotification вызван')
      if (!('Notification' in window)) {
        console.warn('Ваш браузер не поддерживает уведомления')
        return
      }

      if (Notification.permission === 'granted') {
        playBreakSound()
        const notification = new Notification('Время перерыва!', {
          body: 'Пора сделать паузу',
          requireInteraction: true,
        })

        notification.onshow = () => console.log('Уведомление показано')
        notification.onclick = () => {
          console.log('Уведомление кликнуто')
          window.focus()
          notification.close()
        }
        notification.onerror = (e) => console.error('Ошибка уведомления:', e)
        notification.onclose = () => console.log('Уведомление закрыто')
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            showBreakNotification()
          }
        })
      }
    }

    const startNowTimer = () => {
      if (nowTimer === null) {
        nowTimer = setInterval(() => {
          now.value = Date.now()
        }, 1000)
      }
    }

    const stopNowTimer = () => {
      if (nowTimer !== null) {
        clearInterval(nowTimer)
        nowTimer = null
      }
    }

    const startInterval = () => {
      if (!takeABreakReminders.value) {
        clearExistingInterval()
        return
      }

      clearExistingInterval()
      now.value = Date.now()

      if (!lastBreakTimestamp.value) {
        lastBreakTimestamp.value = now.value
      }

      intervalId = setTimeout(() => {
        isBreakNow.value = true
        showBreakNotification()
        clearExistingInterval()
        console.log('[Break] Время перерыва наступило!')
      }, remainingUntilNextBreak.value)

      timerUpdateId = setInterval(() => {
        if (lastBreakTimestamp.value) {
          elapsedSinceLastBreak.value = now.value - lastBreakTimestamp.value
        }
      }, 1000)
    }

    const resetData = () => {
      isBreakNow.value = false
      elapsedSinceLastBreak.value = 0
      seconds.value = 0
      canCloseAlert.value = false
      lastBreakTimestamp.value = null
      newBreakStarted.value = false
    }

    watch(
      takeABreakReminders,
      (newVal) => {
        if (newVal) {
          startNowTimer()
          startInterval()
        } else {
          stopNowTimer()
          clearExistingInterval()
          resetData()
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      if (isBreakTracking.value) {
        startTimer()
      }
    })

    const startTimer = () => {
      stopLoopSound()
      if (timerId) return
      if (!newBreakStarted.value) {
        newBreakStarted.value = true
      }
      timerId = setInterval(() => {
        seconds.value++
        if (seconds.value >= breakForMillis.value / 1000) {
          canCloseAlert.value = true
        }
      }, 1000)
    }

    const stopTimer = () => {
      stopLoopSound()
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      isBreakTracking.value = false
    }

    const resetTimer = () => {
      stopTimer()
      seconds.value = 0
      canCloseAlert.value = false
    }

    const onCloseAlert = () => {
      newBreakStarted.value = false
      lastBreakTimestampWas.value = Date.now()
      resetData()
      stopTimer()
      resetTimer()
    }

    watch(isBreakNow, (newVal, oldVal) => {
      if (oldVal === true && newVal === false && takeABreakReminders.value) {
        startInterval()
      }
    })

    watch(isBreakTracking, (newVal) => {
      if (newVal) {
        startTimer()
      } else {
        stopTimer()
      }
    })

    onScopeDispose(() => {
      clearExistingInterval()
    })

    onUnmounted(() => {
      stopTimer()
      stopNowTimer()
    })

    const formattedTime = computed(() => {
      const m = Math.floor(seconds.value / 60)
        .toString()
        .padStart(2, '0')
      const s = (seconds.value % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    })

    const displayTime = computed(() => formattedTime.value)

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
      lastBreakTimestamp,
      seconds,
      remainingUntilNextBreak,
      resetData,
      startNowTimer,
      stopNowTimer,
      startInterval,
      clearExistingInterval,
      startTimer,
      stopTimer,
      resetTimer,
    }
  },
  {
    persist: true,
  }
)

export const useBreaks = () => {
  const store = useBreaksStore()
  const {
    now,
    canCloseAlert,
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
    lastBreakTimestamp,
    seconds,
    remainingUntilNextBreak,
  } = storeToRefs(store)
  const {
    onCloseAlert,
    resetData,
    startNowTimer,
    stopNowTimer,
    startInterval,
    clearExistingInterval,
    startTimer,
    stopTimer,
    resetTimer,
  } = store

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
    lastBreakTimestamp,
    seconds,
    remainingUntilNextBreak,
    resetData,
    startNowTimer,
    stopNowTimer,
    startInterval,
    clearExistingInterval,
    startTimer,
    stopTimer,
    resetTimer,
  }
}
