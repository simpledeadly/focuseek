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
import DialogClose from '@/shared/ui/dialog/DialogClose.vue'
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel'
import { Card, CardContent } from '@/shared/ui/card'

const mode = useColorMode()
const themes = ['light', 'dark']
const switchMode = (theme: any) => mode.value = theme
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
          <p>Current theme: <strong>{{ mode }}</strong></p>
          <Carousel
            class="w-full max-w-sm"
            orientation="horizontal"
            :opts="{
              align: 'center',
            }"
          >
            <CarouselContent class="-ml-1">
              <CarouselItem v-for="theme in themes" :key="theme" class="pl-1 md:basis-1/2 lg:basis-1/3">
                <div class="p-1">
                  <Card @click="switchMode(theme)">
                    <CardContent class="flex aspect-square items-center justify-center p-6">
                      <span class="text-2xl font-semibold">{{ theme }}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <!-- <CarouselPrevious />
            <CarouselNext /> -->
          </Carousel>
        </div>
        <DialogFooter class="settings-page__footer">
          <DialogClose as-child>
            <Button type="button">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style lang="scss">
* {
  outline: none;
}

.settings-page {
  &__footer {
    display: flex;
    align-items: end;
  }
}
</style>
