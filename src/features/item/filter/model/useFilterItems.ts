import { filterItemsByType, isItemType, useItems, type ItemType } from '@/entities/item'
import { computed } from 'vue'
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

export const useFilterItems = () => {
  const { itemType } = useItemType()
  const { items } = useItems()

  const filteredItems = computed(() => {
    return filterItemsByType(items.value, itemType.value)
  })

  return { itemType, filteredItems }
}
