import { ref, computed } from 'vue'
import { useItems, filterNestedItems, Item } from '@/entities/item'
import { useAddItem } from '@/features/item/add'
import { useChangeItemTitle } from '@/features/item/change-title'
import { useChangeItemDescription } from '@/features/item/change-description'
import { useChangeItemDeadline } from '@/features/item/change-deadline'
import { useChangeItemPriority } from '@/features/item/change-priority'
import { useChangeItemDate } from '@/features/item/change-date'
import { useDoneItem } from '@/features/item/done'
import { useFilterItems } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { useShowSubItems } from '@/features/item/show-sub-items'
import { useCollections } from '@/entities/collection'
import { useSwitchItemCollection } from '@/features/item/switch-collection'
import { useSwitchItemType } from '@/features/item/switch-type'
import { useItemTimeTrack } from '@/features/item/time-track'
import { router } from '@/app/router/router'

export const useItemList = () => {
  const { items, setSelectedItem } = useItems()
  const { itemType, filteredItems, filteredParentItems, collectionId } = useFilterItems(items)
  const { addItem } = useAddItem(items)
  const { removeItem } = useRemoveItem(items)
  const { toggleDoneItem } = useDoneItem(items)
  const { toggleShowSubItems, hasSubItems } = useShowSubItems(items)
  const { changeItemTitle } = useChangeItemTitle(items)
  const { changeItemDescription } = useChangeItemDescription(items)
  const { changeItemDeadline } = useChangeItemDeadline(items)
  const { changeItemDate } = useChangeItemDate(items)
  const { changeItemPriority } = useChangeItemPriority(items)
  const { switchItemType } = useSwitchItemType(items)
  const { changeItemDurationPlanned, changeItemDurationReal, deleteTimer } = useItemTimeTrack(items)
  const { collections, findCollectionTitleById } = useCollections()
  const { switchItemCollection } = useSwitchItemCollection(items)

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
    toggleDoneItem,
    toggleShowSubItems,
    hasSubItems,
    changeItemTitle,
    changeItemDescription,
    changeItemDeadline,
    changeItemDate,
    changeItemPriority,
    switchItemType,
    changeItemDurationPlanned,
    changeItemDurationReal,
    deleteTimer,
    collections,
    findCollectionTitleById,
    switchItemCollection,
    showAllParams,
    isTimeTracking,
    activeKey,
    openDetailsPage,
    filterNestedItems,
  }
}
