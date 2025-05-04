import { computed, ShallowRef } from 'vue'
import { updateItem, replaceItemInList, type Item } from '@/entities/item'
import { updateItemOnServer } from '@/shared/api/api'

export const useShowSubItems = (items: ShallowRef<Item[]>) => {
  const toggleShowSubItems = async (item: Item) => {
    const newItem = updateItem(item, { showSubItems: !item.showSubItems })
    await updateItemOnServer(item.id, newItem)
    items.value = replaceItemInList(items.value, newItem)
  }

  const itemsMap = computed(() => {
    const map = new Map<number | null, Item[]>()
    items.value.forEach((item) => {
      if (item.parentItemId !== undefined) {
        const parentId = item.parentItemId
        map.has(parentId) ? map.get(parentId)!.push(item) : map.set(parentId, [item])
      }
    })
    return map
  })

  const hasSubItems = (itemId: number) => itemsMap.value.has(itemId)

  return { toggleShowSubItems, hasSubItems }
}
