<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { useItems } from '@/entities/item'
import { useFilterItems, useItemType } from '@/features/item/filter'
import { Checkbox } from '@/shared/ui/checkbox'
import { Popover } from '@/shared/ui/popover'
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { Badge } from '@/shared/ui/badge'
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'submit', data: { itemTitle: string; parentId?: number }): void
}>()

const slots = defineSlots<{
  select?: () => unknown
}>()

const itemTitle = ref<string>('')
const parentId = ref<number>()
const { itemType } = useItemType()

const handleSubmit = () => {
  if (itemTitle.value.length > 0) {
    const data = { itemTitle: itemTitle.value, parentId: Number(parentId.value) }
    emit('submit', data)
  } else {
    alert('Введите заголовок')
  }
  itemTitle.value = ''
  parentId.value = undefined
}

const { items } = useItems()
const { filteredItems } = useFilterItems(items)
</script>

<template>
  <div class="add-item-wrapper-inline">
    <div class="item-entity flex items-center space-x-4 rounded-md border pt-2 pb-2">
      <div class="item-entity__row">
        <div class="item-entity__row_part">
          <div class="item-entity__checkbox">
            <Checkbox class="item-checkbox" disabled />
          </div>
          <div class="item-entity__title">
            <div class="item-title__inner-editable">
              <input
                type="text"
                class="item-title__input"
                placeholder="Enter title"
              />
            </div>
          </div>
        </div>
        <div class="item-entity__row_part">
          <div class="item-entity__timeLeft">
            <PopoverRoot>
              <PopoverTrigger as-child>
                <Badge
                  variant="outline"
                  class="item-deadline"
                >
                  {{ 'Add DL' }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-2 space-y-2">
                <Input placeholder="YYYY-M-DD HH:mm" />
                <Button>Save</Button>
              </PopoverContent>
            </PopoverRoot>
          </div>
          <div class="item-entity__remove-button">
            <button
              type="button"
              class="item-remove-button"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.add-item-wrapper-inline {
  /** keep */
}
</style>
