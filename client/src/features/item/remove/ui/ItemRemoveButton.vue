<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { capitalize } from '@/shared/lib/utils'
import type { Item } from '@/entities/item/types/item'
import { useItemType } from '@/features/item/filter'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  (e: 'remove'): void
}>()

const props = defineProps<{
  item: Item
}>()

const { itemType } = useItemType()

const toaster = () => {
  toast(capitalize(itemType.value) + ' deleted', {
    description: 'It was: "' + props.item.title + '" and all sub-items',
    class: 'toast',
  })
}

const handleDelete = () => {
  if (confirm('Вы уверены, что хотите удалить этот элемент и все его подэлементы?')) {
    emit('remove')
    toaster()
  }
}
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <button
        type="button"
        class="item-remove-button"
        @click="handleDelete"
      >
        <Trash2 :size="16" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>
        Delete {{ itemType }}
        <br>
        (id: <b>{{ item.id }}</b>)
        <div v-if="item.parentItemId">
          (parentId: <b>{{ item.parentItemId }}</b>)
        </div>
      </p>
    </TooltipContent>
  </Tooltip>
</template>

<style lang="scss">
.item-remove-button {
  display: flex;
  color: hsl(var(--muted-foreground));
  transition: all 0.05s;

  &:hover {
    color: hsl(var(--foreground));
  }
}
</style>
