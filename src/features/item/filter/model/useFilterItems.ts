import { filterItemsByType, isItemType, Item, type ItemType } from '@/entities/item'
import { computed, ShallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useItemType = () => {
  const route = useRoute()
  const router = useRouter()

  const itemType = computed<ItemType>({
    get: () => {
      const type = route.query.type
      return isItemType(type) ? type : 'todo'
    },
    set: (type) => {
      router.push({ query: { type } })
    },
  })

  return { itemType }
}

export const useFilterItems = (items: ShallowRef<Item[]>) => {
  const { itemType } = useItemType()

  const filteredItems = computed(() => {
    return filterItemsByType(items.value, itemType.value)
  })

  return { itemType, filteredItems }
}
