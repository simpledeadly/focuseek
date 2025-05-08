import { ref, computed } from 'vue'
import { useItems, filterNestedItems, Item } from '@/entities/item'
import { router } from '@/app/router/router'
import { useAddItem } from '@/features/item/add'
import { useFilterItems } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { useShowSubItems } from '@/features/item/show-sub-items'
import { useCollections } from '@/entities/collection'
import { useItemTimeTrack } from '@/features/item/time-track'
import { useItemUpdater } from '@/features/item/composables/useItemUpdater'

export const useItemList = () => {
  const { items, setSelectedItem } = useItems()
  const { itemType, filteredItems, filteredParentItems, collectionId } = useFilterItems(items)
  const { updateItemProperty } = useItemUpdater(items)

  const { addItem } = useAddItem(items)
  const { removeItem } = useRemoveItem(items)
  const { toggleShowSubItems, hasSubItems } = useShowSubItems(items)
  const { resetTimer, deleteTimer } = useItemTimeTrack(items)
  const { collections, findCollectionTitleById } = useCollections()

  const showAllParams = ref<boolean>(false)
  const isTimeTracking = ref<boolean>(false)

  const activeKey = computed(() => {
    const colId = collectionId.value != null && collectionId.value
    const type = itemType.value
    return `${colId}__${type}`
  })

  const openDetailsPage = (item: Item) => {
    setSelectedItem(item)
    router.push({
      path: `/${findCollectionTitleById(item.collectionId).toLowerCase()}/${item.id}`,
    })
  }

  return {
    items,
    setSelectedItem,
    itemType,
    filteredItems,
    filteredParentItems,
    collectionId,
    addItem,
    removeItem,
    toggleShowSubItems,
    hasSubItems,
    resetTimer,
    deleteTimer,
    collections,
    findCollectionTitleById,
    showAllParams,
    isTimeTracking,
    activeKey,
    openDetailsPage,
    filterNestedItems,
    updateItemProperty,
  }
}
