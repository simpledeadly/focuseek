<script setup lang="ts">
import { ref, watch } from 'vue'
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
import { HideToggle } from '@/widgets/hide-toggle'

const isHideDone = ref(JSON.parse(localStorage.getItem('hide')!) || false)

watch(isHideDone, () => localStorage.setItem('hide', isHideDone.value.toString()))

const handleReload = () => window.location.reload()

const mode = useColorMode()
const themes = ['auto', 'dark', 'light']
const switchMode = (theme: any) => (mode.value = theme)

const checkboxStylePacks = [
  {
    id: 1,
    title: 'first',
    p1: '#FF0060',
    p2: '#F6FA70',
    p3: '#0079FF',
  },
  {
    id: 2,
    title: 'second',
    p1: '#FF1E1E',
    p2: '#FFFF00',
    p3: '#00FFD1',
  },
  {
    id: 3,
    title: 'third',
    p1: '#FF4A4A',
    p2: '#FF9551',
    p3: '#6FEDD6',
  },
  {
    id: 4,
    title: 'fouth',
    p1: '#ff2626',
    p2: '#ffae00',
    p3: '#007fff',
    p0: '#fff',
  },
]

const pack = JSON.parse(localStorage.getItem('pack')!)

const handleSwitchPack = (id: number) => {
  console.log('chosen pack with id:', id)
  localStorage.setItem('pack', JSON.stringify(checkboxStylePacks[id - 1]))
}

const getColors = (pack: Record<string, any>) => {
  if (!pack) return []
  const keys = Object.keys(pack).filter((key) => /^p\d+$/.test(key))
  keys.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))
  return keys.map((key) => pack[key])
}
</script>

<template>
  <div class="settings-page">
    <Dialog>
      <DialogTrigger as-child>
        <Bolt
          :size="18"
          class="app__bolt-icon icon"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Here you can change theme</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <p>
            Current theme: <strong>{{ mode }}</strong>
          </p>
          <Carousel
            class="w-full max-w-sm"
            orientation="horizontal"
            :opts="{
              align: 'center',
            }"
          >
            <CarouselContent class="-ml-1">
              <CarouselItem
                v-for="theme in themes"
                :key="theme"
                class="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div class="p-1">
                  <Card @click="switchMode(theme)">
                    <CardContent class="flex aspect-square items-center justify-center p-6">
                      <span class="text-2xl font-semibold">{{ theme }}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <p>
            Current pack: <strong>{{ pack.title ?? 'no pack' }}</strong>
          </p>
          <Carousel
            class="w-full max-w-sm"
            orientation="horizontal"
            :opts="{
              align: 'center',
            }"
          >
            <CarouselContent class="-ml-1">
              <CarouselItem
                v-for="pack in checkboxStylePacks"
                :key="pack.id"
                class="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div class="p-1">
                  <Card
                    @click="handleSwitchPack(pack.id)"
                    class="color-split-card"
                  >
                    <CardContent class="color-split-content p-0">
                      <template
                        v-for="(color, _index) in getColors(pack)"
                        :key="index"
                      >
                        <div
                          class="color-part"
                          :style="{ backgroundColor: color }"
                        />
                      </template>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <HideToggle v-model="isHideDone" />
        </div>
        <DialogFooter class="settings-page__footer">
          <DialogClose as-child>
            <Button
              type="button"
              @click="handleReload"
              >Save changes</Button
            >
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

.color-split-card {
  position: relative;
  cursor: pointer;

  .color-split-content {
    display: flex;
    flex-direction: column; /* вертикальное расположение */
    height: 110px; /* фиксированная высота для карточки */
    padding: 0 !important;
    position: relative;
    border-radius: 6px; /* чтобы карточка была с закруглениями */
    overflow: hidden; /* чтобы цвета не выходили за края */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* легкая тень для объема */
  }

  .color-part {
    flex: 1; /* равномерное деление высоты */
    width: 100%; /* растянуть по ширине */
  }
}
</style>
