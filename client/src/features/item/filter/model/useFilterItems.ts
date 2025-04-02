import { computed, ref, ShallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  filterItemsByCollection,
  filterParentItems,
  filterItemsByType,
  filterDoneItems,
  isItemType,
  Item,
  type ItemType,
} from '@/entities/item'
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
      router.push({ query: { type } })
    },
  })

  return { itemType }
}

export const useHideDone = () => {
  const isHideDone = ref(JSON.parse(localStorage.getItem('hide')!) || false)

  return { isHideDone }
}

export const useFilterItems = (items: ShallowRef<Item[]>) => {
  const { itemType } = useItemType()
  const { isHideDone } = useHideDone()
  const { collections, collection, collectionId } = useCollection()

  if (!collectionId) {
    console.log('collectionId not found', collections.value, collection, collectionId)
    throw new Error('collectionId not found')
  }

  const filteredDoneItems = filterDoneItems(items.value)

  const filteredParentItems = computed(() => {
    const filteredItemsByCollection = filterItemsByCollection(items.value, collectionId.value)

    return filterParentItems(
      filterItemsByType(
        isHideDone.value
          ? filterItemsByCollection(filteredDoneItems, collectionId.value)
          : filteredItemsByCollection,
        itemType.value
      )
    )
  })

  const filteredItems = computed(() => {
    const filteredItemsByCollection = filterItemsByCollection(items.value, collectionId.value)

    return filterItemsByType(
      isHideDone.value
        ? filterItemsByCollection(filteredDoneItems, collectionId.value)
        : filteredItemsByCollection,
      itemType.value
    )
  })

  return {
    itemType,
    filteredItems,
    filteredDoneItems,
    filteredParentItems,
    collectionId,
    isHideDone,
  }
}
