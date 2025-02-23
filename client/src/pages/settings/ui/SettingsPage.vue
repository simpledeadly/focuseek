<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Bolt } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
</script>

<template>
  <div class="settings-page">
    <Dialog>
      <DialogTrigger as-child>
        <Bolt
          :size="18"
          class="app__bolt-icon"
        />
      </DialogTrigger>
      <DialogContent class="sm:min-w-[90vw] sm:min-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Here you can change theme</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <p>Текущая тема: {{ mode }}</p>
          <button @click="mode = 'light'">light</button>
          <button @click="mode = 'dark'">dark</button>
        </div>
        <DialogFooter class="settings-page__footer">
          <Button type="button">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style lang="scss">
.settings-page {
  &__footer {
    display: flex;
    align-items: end;
  }
}
</style>
