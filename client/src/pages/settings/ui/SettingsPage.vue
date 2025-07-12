<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useBreaks } from '@/app/stores'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Card, CardContent } from '@/shared/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel'
import { parseUnixTimestampToDuration } from '@/shared/lib/utils'
import { Bolt } from 'lucide-vue-next'
import { checkboxStylePacks } from '@/app/packs'

const { breakPer, breakFor, takeABreakReminders, remainingUntilNextBreak } = useBreaks()

const mode = useColorMode()
const themes = ['auto', 'dark', 'light']
const switchMode = (theme: any) => (mode.value = theme)

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
          <div class="flex flex-col gap-2">
            <p>Break</p>
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2 items-center">
                <Checkbox v-model="takeABreakReminders" />
                <Input
                  type="text"
                  class="w-24"
                  placeholder="Every"
                  v-model="breakPer"
                />
                <Input
                  type="text"
                  class="w-24"
                  placeholder="Duration"
                  v-model="breakFor"
                />
              </div>
              <div>
                <span class="text-muted-foreground">Before break: </span>
                <span>{{ parseUnixTimestampToDuration(remainingUntilNextBreak) }}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter class="settings-page__footer">
          <DialogClose as-child>
            <Button
              variant="secondary"
              type="button"
              >Apply</Button
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
    flex-direction: column;
    height: 110px;
    padding: 0 !important;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .color-part {
    flex: 1;
    width: 100%;
  }
}
</style>
