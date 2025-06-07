<script setup lang="ts">
import { ref } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  tags?: string[]
}>()

const emit = defineEmits<{
  (e: 'change', value?: string[]): void
}>()

const inputValue = ref<string>()

const onChangeTag = (index: number, newValue?: string | null) => {
  if ((inputValue.value && inputValue.value.trim().length > 0) || newValue === null) {
    const newTags = props.tags && props.tags.map((tag, i) => (i === index ? newValue : tag))
    const filteredTags: string[] = (newTags ?? []).filter((tag): tag is string => tag != undefined)
    emit('change', filteredTags)
  } else {
    alert('Введите тег')
  }
  inputValue.value = ''
}
</script>

<template>
  <div class="item-tags">
    <Popover v-for="(tag, index) in props.tags">
      <PopoverTrigger
        as-child
        @click="inputValue = tag"
      >
        <Badge
          :variant="props.tags && props.tags.length > 0 ? 'secondary' : 'outline'"
          :class="
            cn(
              'item-tags__tag justify-start text-left font-medium uppercase text-muted-foreground',
              !props.tags && 'text-muted-foreground'
            )
          "
        >
          {{ tag }}
        </Badge>
      </PopoverTrigger>
      <PopoverContent class="flex w-auto flex-col gap-y-1 p-1">
        <Input
          type="text"
          v-model="inputValue"
          placeholder="Change tag"
          @keydown.enter="onChangeTag(index, inputValue)"
        />
        <Button
          class="mt-1 w-full"
          variant="secondary"
          size="sm"
          @click="onChangeTag(index, null)"
          :disabled="!tag"
          >Remove</Button
        >
      </PopoverContent>
    </Popover>
  </div>
</template>

<style lang="scss">
.item-tags {
  display: flex;
  gap: 4px;

  &__tag {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
}
</style>
