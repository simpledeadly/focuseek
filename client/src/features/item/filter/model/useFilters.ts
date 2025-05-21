import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useLoading } from '@/app/useLoading'
import { formatDateToYMD } from '@/shared/lib/utils'
import { isItemType, useItems, type Item, type ItemType } from '@/entities/item'
import { useCollection } from '@/features/collection/filter'

export const useFiltersStore = defineStore(
  'filters',
  () => {
    const route = useRoute()
    const router = useRouter()
    const { collectionId } = useCollection()
    const { isLoading } = useLoading()

    const { items } = useItems()

    const isHideDone = ref(false)

    const dateFilter = ref<'all' | 'today'>('all')
    const priorityFilter = ref<number | null>(0)
    const sortBy = ref<'date' | 'priority' | 'default' | 'isDone'>('isDone')
    const sortOrder = ref<'asc' | 'desc'>('asc')

    const itemType = computed<ItemType>({
      get: () => {
        const type = route.query.type
        return isItemType(type) ? type : 'todo'
      },
      set: (type: ItemType) => {
        router.push({ query: { ...route.query, type } })
      },
    })

    const filters = reactive({
      itemType: itemType.value,
      collectionId: collectionId.value,
    })

    function applyFilters(
      arr: Item[],
      filters: {
        itemType: ItemType
        collectionId: number | null
        dateFilter: 'all' | 'today'
        priorityFilter: number | null
        isDone: boolean
      }
    ): Item[] {
      const todayStr = formatDateToYMD(new Date())

      return arr.filter((item) => {
        if (filters.itemType && item.type !== filters.itemType) return false
        if (filters.collectionId !== null && item.collectionId !== filters.collectionId)
          return false
        if (filters.dateFilter === 'today') {
          if (!item.date) return false
          if (formatDateToYMD(new Date(item.date)) !== todayStr) return false
        }
        if (filters.priorityFilter !== 0 && filters.priorityFilter !== item.priority) return false
        if (filters.isDone && item.isDone) return false
        return true
      })
    }

    function applySorting(
      arr: Item[],
      sortByValue: 'default' | 'date' | 'priority' | 'isDone',
      sortOrderValue: 'asc' | 'desc'
    ): Item[] {
      if (sortByValue === 'default') return arr

      return [...arr].sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortByValue === 'date') {
          aValue = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER
          bValue = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER
        }
        if (sortByValue === 'priority') {
          aValue = a.priority ?? Number.MAX_SAFE_INTEGER
          bValue = b.priority ?? Number.MAX_SAFE_INTEGER
        }

        if (aValue < bValue) return sortOrderValue === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrderValue === 'asc' ? 1 : -1
        return 0
      })
    }

    const filteredItems = computed(() => {
      if (isLoading.value) return []

      return applyFilters(items.value, {
        itemType: itemType.value,
        collectionId: collectionId.value,
        dateFilter: dateFilter.value,
        priorityFilter: priorityFilter.value,
        isDone: isHideDone.value,
      })
    })

    const rootItems = computed(() =>
      filteredItems.value.filter((item) => item.parentItemId === null)
    )

    const sortedItems = computed({
      get() {
        if (sortBy.value === 'default') {
          return [...rootItems.value].sort((a, b) => a.order - b.order)
        } else if (sortBy.value === 'isDone') {
          return [...rootItems.value].sort((a, b) => {
            if (a.isDone !== b.isDone) return Number(a.isDone) - Number(b.isDone)
            if (!a.isDone && !b.isDone) return a.order - b.order
            return (b.editedAt ?? 0) - (a.editedAt ?? 0)
          })
        } else {
          return applySorting(rootItems.value, sortBy.value, sortOrder.value)
        }
      },
      set(newList: Item[]) {
        if (sortBy.value === 'default') {
          newList.forEach((item, index) => {
            const original = items.value.find((i) => i.id === item.id)
            if (original) original.order = index + 1
          })
        }
      },
    })

    return {
      items,
      itemType,
      isHideDone,
      filters,
      dateFilter,
      priorityFilter,
      sortBy,
      sortOrder,
      collectionId,
      filteredItems,
      rootItems,
      sortedItems,
      applyFilters,
      applySorting,
    }
  },
  {
    persist: true,
  }
)

export const useFilters = () => {
  const store = useFiltersStore()
  const {
    items,
    itemType,
    isHideDone,
    filters,
    dateFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    collectionId,
    filteredItems,
    rootItems,
    sortedItems,
  } = storeToRefs(store)
  const { applyFilters, applySorting } = store

  return {
    items,
    itemType,
    isHideDone,
    filters,
    dateFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    collectionId,
    filteredItems,
    rootItems,
    sortedItems,
    applyFilters,
    applySorting,
  }
}
