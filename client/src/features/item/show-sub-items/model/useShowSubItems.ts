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

/*
import { useItemUpdater } from '../../composables/useItemUpdater'

export const useShowSubItems = (items: ShallowRef<Item[]>) => {
  const { updateItemProperty } = useItemUpdater(items)

  const itemsMap = computed(() => {
    return items.value.reduce((map, item) => {
      const parentId = item.parentItemId ?? null
      map.set(parentId, [...(map.get(parentId) || []), item])
      return map
    }, new Map<number | null, Item[]>())
  })

  const hasSubItems = (itemId: number) => itemsMap.value.get(itemId)?.length > 0

  const toggleShowSubItems = async (item: Item) => {
    await updateItemProperty(item, {
      showSubItems: !item.showSubItems,
    })
  }

  return {
    toggleShowSubItems,
    hasSubItems,
    itemsMap,
  }
}
*/
