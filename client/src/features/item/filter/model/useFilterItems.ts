import { computed, reactive, ref, ShallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isItemType, Item, type ItemType } from '@/entities/item'
import { useCollection } from '@/features/collection/filter'

export const useItemType = () => {
  const route = useRoute()
  const router = useRouter()

  const itemType = computed<ItemType>({
    get: () => {
      const type = route.query.type
      return isItemType(type) ? type : 'todo'
    },
    set: (type: ItemType) => {
      router.push({ query: { ...route.query, type } })
    },
  })

  return { itemType }
}

export const useHideDone = () => {
  const isHideDone = ref<boolean>(false)
  try {
    const stored = localStorage.getItem('hide')
    if (stored !== null) isHideDone.value = JSON.parse(stored)
  } catch {}

  return { isHideDone }
}

export const useFilterItems = (items: ShallowRef<Item[]>) => {
  const { itemType } = useItemType()
  const { isHideDone } = useHideDone()
  const { collections, collection, collectionId } = useCollection()

  if (!collectionId.value) {
    console.error('collectionId not found', collections.value, collection.value, collectionId.value)
    throw new Error('collectionId not found')
  }

  const filters = reactive({
    itemType: itemType.value,
    collectionId: collectionId.value,
  })

  function applyFilters(
    arr: Item[],
    filters: {
      itemType: ItemType
      collectionId: number | null
    }
  ): Item[] {
    return arr.filter((item) => {
      if (filters.itemType && item.type !== filters.itemType) return false
      if (filters.collectionId !== null && item.collectionId !== filters.collectionId) return false
      if (isHideDone.value && item.isDone) return false
      return true
    })
  }

  const filteredItems = computed(() => {
    return applyFilters(items.value, {
      itemType: itemType.value,
      collectionId: collectionId.value,
    })
  })

  const rootItems = computed(() => filteredItems.value.filter((item) => item.parentItemId === null))

  return {
    itemType,
    rootItems,
    filteredItems,
    filters,
    collectionId,
    isHideDone,
  }
}
