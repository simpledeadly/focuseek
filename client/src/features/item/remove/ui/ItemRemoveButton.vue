<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { capitalize } from '@/shared/lib/utils'
import type { Item } from '@/entities/item/types/item'
import { useItems } from '@/entities/item/model/useItems'
import { useItemType } from '@/features/item/filter'
import { useAddItem } from '@/features/item/add'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  (e: 'remove'): void
}>()

const props = defineProps<{
  item: Item
}>()

const { items } = useItems()
const { itemType } = useItemType()
const { addItem } = useAddItem(items)

const toaster = () => {
  toast(capitalize(itemType.value) + ' deleted', {
    description: 'It was: ' + props.item.title,
    action: {
      label: 'Undo',
      onClick: () => addItem(props.item.title, itemType.value),
    },
  })
}

const handleDelete = () => {
  emit('remove')
  toaster()
}

// другой вариант: убрать item из UI, но в базе оставить на время, пока sonner не пропадёт
</script>

<template>
  <TooltipProvider>
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
        <p>Delete {{ itemType }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style lang="scss">
.item-remove-button {
  display: flex;
  color: hsl(var(--muted-foreground));

  &:hover {
    color: hsl(var(--foreground));
  }
}
</style>
