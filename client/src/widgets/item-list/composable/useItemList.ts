import { ref, computed, watchEffect } from 'vue'
import { useItems, filterNestedItems, Item } from '@/entities/item'
import { router } from '@/app/router/router'
import { useAddItem } from '@/features/item/add'
import { useFilters } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { useShowSubItems } from '@/features/item/show-sub-items'
import { useCollections } from '@/entities/collection'
import { useItemTimeTrack } from '@/features/item/time-track'
import { useItemUpdater } from '@/features/item/composables/useItemUpdater'
import { OrderUpdate, updateItemsOrder } from '@/shared/api/api'
import { reactive } from 'vue'

export const useItemList = () => {
  const { items, updateOrderOfItem, setSelectedItem } = useItems()
  const {
    filters,
    dateFilter,
    priorityFilter,
    itemType,
    isHideDone,
    sortBy,
    sortOrder,
    rootItems,
    filteredItems,
    sortedItems,
    collectionId,
  } = useFilters()
  const { updateItemProperty } = useItemUpdater(items)

  const { addItem } = useAddItem(items)
  const { removeItem } = useRemoveItem(items)
  const { toggleShowSubItems, hasSubItems } = useShowSubItems(items)
  const { resetTimer, deleteTimer } = useItemTimeTrack(items)
  const { collections, findCollectionTitleById, findIdByCollectionTitle } = useCollections()

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

  function calcOrder(
    prevOrder: number | null,
    nextOrder: number | null,
    list: Item[],
    newIndex: number
  ): number {
    const minStep = 0.0001

    if (list.length === 0) return 1

    if (newIndex === 0) {
      return nextOrder !== null ? Math.max(nextOrder / 2, minStep) : 1
    }

    if (newIndex === list.length - 1) {
      return prevOrder !== null ? prevOrder + 1 : 1
    }

    if (prevOrder === null && nextOrder !== null) return nextOrder - 1
    if (nextOrder === null && prevOrder !== null) return prevOrder + 1
    if (prevOrder !== null && nextOrder !== null) return (prevOrder + nextOrder) / 2

    return 1
  }

  function normalizeOrder(items: Item[], step = 10): Item[] {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    return sorted.map((item, index) => ({
      ...item,
      order: (index + 1) * step,
    }))
  }

  function needsNormalization(items: Item[]): boolean {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].order - sorted[i - 1].order < 0.0001) {
        return true
      }
    }
    return false
  }

  const onDragStart = (event: any) => {
    console.log('Начало перетаскивания:', event.item.dataset.id)
  }

  function onDragEnd(evt: any) {
    console.log(
      'Drag ended, new order:',
      sortedItems.value.map((i) => ({ id: i.id, order: i.order }))
    )

    const newIndex = evt.newIndex
    const oldIndex = evt.oldIndex
    const list = sortedItems.value

    const movedItem = list[oldIndex]

    const prevOrder = newIndex > 0 ? list[newIndex - 1].order : null
    const nextOrder = newIndex < list.length - 1 ? list[newIndex + 1].order : null

    const newOrder = calcOrder(prevOrder, nextOrder, list, newIndex)

    if (movedItem.order !== newOrder) {
      updateOrderOfItem(movedItem.id, newOrder)
    }

    if (needsNormalization(items.value)) {
      items.value = normalizeOrder(items.value)
      const updates: OrderUpdate[] = items.value.map(({ id, order }) => ({ id, order }))
      updateItemsOrder(updates)
        .then(() => console.log('Порядок нормализован и сохранён'))
        .catch(console.error)
    } else {
      updateItemsOrder([{ id: movedItem.id, order: newOrder }])
        .then(() => console.log('Порядок успешно сохранён'))
        .catch(console.error)
    }
  }

  function getNestedItems(parentId: number) {
    return computed(() =>
      filteredItems.value
        .filter((item) => item.parentItemId === parentId)
        .sort((a, b) => a.order - b.order)
    )
  }

  const nestedItemsMap = reactive<Record<number, Item[]>>({})

  watchEffect(() => {
    rootItems.value.forEach((parent) => {
      const filtered = filteredItems.value
        .filter((i) => i.parentItemId === parent.id)
        .sort((a, b) => a.order - b.order)

      if (!nestedItemsMap[parent.id]) {
        nestedItemsMap[parent.id] = reactive(filtered)
      } else {
        nestedItemsMap[parent.id].splice(0, nestedItemsMap[parent.id].length, ...filtered)
      }
    })
  })

  function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return

    const element = arr.splice(fromIndex, 1)[0]
    arr.splice(toIndex, 0, element)
  }

  function onDragStartNested(evt: any, parentId: number) {
    const list = nestedItemsMap[parentId]
    const draggedItem = list[evt.oldIndex]
    console.log('Начало перетаскивания:', draggedItem?.id)
  }

  function onDragEndNested(evt: any, parentId: number) {
    const list = nestedItemsMap[parentId]

    console.log(`Перемещаем элемент с oldIndex=${evt.oldIndex} на newIndex=${evt.newIndex}`)
    console.log(
      'До перемещения:',
      list.map((i) => i.id)
    )

    arrayMove(list, evt.oldIndex, evt.newIndex)

    console.log(
      'После перемещения:',
      list.map((i) => i.id)
    )

    list.forEach((item, index) => {
      item.order = index + 1
      const original = items.value.find((i) => i.id === item.id)
      if (original) original.order = item.order
    })

    const updates = list.map(({ id, order }) => ({ id, order }))
    updateItemsOrder(updates)
      .then(() => console.log('Порядок вложенных элементов сохранён'))
      .catch(console.error)
  }

  return {
    filters,
    dateFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    items,
    isHideDone,
    nestedItemsMap,
    sortedItems,
    getNestedItems,
    onDragStart,
    onDragStartNested,
    onDragEnd,
    onDragEndNested,
    setSelectedItem,
    itemType,
    filteredItems,
    collectionId,
    addItem,
    removeItem,
    toggleShowSubItems,
    hasSubItems,
    resetTimer,
    deleteTimer,
    collections,
    findCollectionTitleById,
    findIdByCollectionTitle,
    showAllParams,
    isTimeTracking,
    activeKey,
    openDetailsPage,
    filterNestedItems,
    updateItemProperty,
  }
}
