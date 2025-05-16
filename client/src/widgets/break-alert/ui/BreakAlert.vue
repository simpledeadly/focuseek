<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { useBreaks } from '@/app/stores'
import { Button } from '@/shared/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { parseUnixTimestampToDuration } from '@/shared/lib/utils'

const {
  now,
  canCloseAlert,
  onCloseAlert,
  lastBreak,
  displayTime,
  displayTimeTitle,
  isBreakTracking,
  newBreakStarted,
  isBreakNow,
  lastBreakTimestampWas,
} = useBreaks()
</script>

<template>
  <AlertDialog
    class="break-alert"
    v-model:open="isBreakNow"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle v-if="!newBreakStarted"
          >Прошло уже больше
          {{ displayTimeTitle }}
          с последнего перерыва!
        </AlertDialogTitle>
        <AlertDialogTitle v-else>Отдых</AlertDialogTitle>
        <AlertDialogDescription
          >Можно встать, размяться, выпить стакан воды, размять глаза.</AlertDialogDescription
        >
      </AlertDialogHeader>
      <AlertDialogFooter class="flex items-center">
        <AlertDialogDescription v-if="lastBreakTimestampWas">
          Предыдущий перерыв закончился
          <span class="text-foreground">
            {{ lastBreak }}
          </span>
          {{
            lastBreakTimestampWas &&
            `(${parseUnixTimestampToDuration(now - lastBreakTimestampWas)} назад)`
          }}
        </AlertDialogDescription>
        <Button
          size="sm"
          class="gap-1"
          :variant="isBreakTracking ? 'default' : 'secondary'"
          @click="isBreakTracking = !isBreakTracking"
        >
          <Play
            v-if="!isBreakTracking"
            class="w-4 h-4"
          />
          <Pause
            v-else
            class="w-4 h-4"
          />
          {{ displayTime }}
        </Button>
        <Button
          size="sm"
          @click="onCloseAlert"
          :disabled="!canCloseAlert"
          >Продолжить</Button
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style lang="scss">
.break-alert {
  /** keep */
}
</style>
