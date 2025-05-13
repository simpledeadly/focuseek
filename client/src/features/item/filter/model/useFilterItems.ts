import { computed, reactive, ref, ShallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateToYMD } from '@/shared/lib/utils'
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
  const isHideDone = ref(!!localStorage.getItem('hide'))

  try {
    const stored = localStorage.getItem('hide')
    if (stored !== null) isHideDone.value = JSON.parse(stored)
  } catch {}

  watch(isHideDone, (newVal) => {
    try {
      localStorage.setItem('hide', JSON.stringify(newVal))
    } catch {}
  })

  return { isHideDone }
}

export const useFilterItems = (items: ShallowRef<Item[]>) => {
  const { itemType } = useItemType()
  const { isHideDone } = useHideDone()
  const { collectionId, loading } = useCollection()

  const filters = reactive({
    itemType: itemType.value,
    collectionId: collectionId.value,
  })

  const dateFilter = ref<'all' | 'today'>('all')

  const priorityFilter = ref<number | null>(0)

  const applyFilters = (
    arr: Item[],
    filters: {
      itemType: ItemType
      collectionId: number | null
      dateFilter: 'all' | 'today'
      priorityFilter: number | null
    },
    isHideDoneValue: boolean
  ): Item[] => {
    const todayStr = formatDateToYMD(new Date())

    return arr.filter((item) => {
      if (filters.itemType && item.type !== filters.itemType) return false
      if (filters.collectionId !== null && item.collectionId !== filters.collectionId) return false
      if (filters.dateFilter === 'today') {
        if (!item.date) return false
        if (formatDateToYMD(new Date(item.date)) !== todayStr) return false
      }
      if (filters.priorityFilter !== 0 && filters.priorityFilter !== item.priority) return false

      if (isHideDoneValue && item.isDone) return false

      return true
    })
  }

  const sortBy = ref<'date' | 'priority' | 'default'>('default')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  function applySorting(
    arr: Item[],
    sortBy: 'default' | 'date' | 'priority',
    sortOrder: 'asc' | 'desc'
  ): Item[] {
    if (sortBy === 'default') return arr

    return [...arr].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortBy === 'date') {
        aValue = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER
        bValue = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER
      }
      if (sortBy === 'priority') {
        aValue =
          a.priority !== null && a.priority !== undefined ? a.priority : Number.MAX_SAFE_INTEGER
        bValue =
          b.priority !== null && b.priority !== undefined ? b.priority : Number.MAX_SAFE_INTEGER
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  const filteredItems = computed(() => {
    if (loading.value) return []

    const filtered = applyFilters(
      items.value,
      {
        itemType: itemType.value,
        collectionId: collectionId.value,
        dateFilter: dateFilter.value,
        priorityFilter: priorityFilter.value,
      },
      isHideDone.value
    )

    return applySorting(filtered, sortBy.value, sortOrder.value)
  })

  const rootItems = computed(() => filteredItems.value.filter((item) => item.parentItemId === null))

  const sortedItems = computed({
    get() {
      if (sortBy.value === 'default') {
        return [...rootItems.value].sort((a, b) => a.order - b.order)
      } else {
        return rootItems.value
      }
    },
    set(newList) {
      if (sortBy.value === 'default') {
        newList.forEach((item, index) => {
          const original = items.value.find((i) => i.id === item.id)
          if (original) {
            original.order = index + 1
          }
        })
      }
    },
  })

  return {
    itemType,
    rootItems,
    filteredItems,
    sortedItems,
    filters,
    dateFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    collectionId,
    isHideDone,
  }
}
