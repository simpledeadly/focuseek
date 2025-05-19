<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/shared/ui/pagination'
import { Button } from '@/shared/ui/button'
import { useSidebar } from '@/shared/ui/sidebar'
import { AddItemFormInline } from '@/features/item/add'
import { Search } from '@/widgets/search'
import { useItemList, ItemList } from '..'

const {
  sortedItems,
  activeKey,
  filteredItems,
  itemType,
  collections,
  collectionId,
  showAllParams,
  isTimeTracking,
  updateItemProperty,
  addItem,
  removeItem,
  toggleShowSubItems,
  hasSubItems,
  deleteTimer,
  openDetailsPage,
  filterNestedItems,
} = useItemList()

const { isMobile } = useSidebar()

const itemsPerPage = 10
const currentPage = ref<number>(1)

watch([itemType, collectionId], () => {
  currentPage.value = 1
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedItems.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(sortedItems.value.length / itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <Search />
  <Pagination
    :items-per-page="itemsPerPage"
    :total="sortedItems.length"
    :sibling-count="1"
    :default-page="currentPage"
    @update:page="goToPage"
    class="flex justify-center mb-2"
    show-edges
  >
    <PaginationList
      v-slot="{ items }"
      class="flex items-center gap-1"
    >
      <PaginationPrev @click="goToPage(currentPage - 1)" />

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="w-8 h-8 p-0 hover:text-opacity-70"
            :variant="item.value === currentPage ? 'default' : 'outline'"
            @click="goToPage(item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="item.type"
          :index="index"
        />
      </template>

      <PaginationNext @click="goToPage(currentPage + 1)" />
    </PaginationList>
  </Pagination>
  <div
    class="item-list"
    :style="isMobile && 'width: 85vw'"
  >
    <Transition
      name="fade-list"
      mode="default"
    >
      <div :key="activeKey">
        <TransitionGroup name="fade-list">
          <div
            v-for="item in paginatedItems"
            :key="item.id"
          >
            <ItemList
              :item="item"
              :filtered-items="filteredItems"
              :collections="collections"
              :item-type="itemType"
              :show-all-params="showAllParams"
              :is-time-tracking="isTimeTracking"
              :has-sub-items="hasSubItems"
              :filter-nested-items="filterNestedItems"
              :openDetailsPage="openDetailsPage"
              @toggle-done="updateItemProperty"
              @change-title="updateItemProperty"
              @change-description="updateItemProperty"
              @change-duration-planned="updateItemProperty"
              @change-duration-real="updateItemProperty"
              @delete-timer="deleteTimer"
              @change-date="updateItemProperty"
              @change-deadline="updateItemProperty"
              @change-priority="updateItemProperty"
              @switch-collection="updateItemProperty"
              @switch-type="updateItemProperty"
              @remove="removeItem"
              @toggle-show-sub-items="toggleShowSubItems"
              @add-description="updateItemProperty"
              @remove-description="updateItemProperty"
              @open-details-page="openDetailsPage"
            />
          </div>
          <AddItemFormInline
            v-model:type="itemType"
            key="add-item-form"
            @submit="
              addItem(
                collectionId ?? 0,
                $event.itemTitle,
                itemType,
                $event.parentId,
                $event.description,
                $event.deadline,
                $event.date,
                $event.priority,
                $event.durationPlanned
              )
            "
          >
          </AddItemFormInline>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.item-list {
  width: 70vw;
  margin-bottom: 40rem;
}
</style>
