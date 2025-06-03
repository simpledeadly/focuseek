<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Toggle } from '@/shared/ui/toggle'
import { ItemEntity, useItems } from '@/entities/item'
import { useCollections } from '@/entities/collection'
import { AddItemFormInline } from '@/features/item/add'
import { ItemTitle } from '@/features/item/change-title'
import { ItemDescription } from '@/features/item/change-description'
import { ItemDeadline } from '@/features/item/change-deadline'
import { ItemPriority } from '@/features/item/change-priority'
import { ItemDate } from '@/features/item/change-date'
import { ItemTags } from '@/features/item/change-tags'
import { ItemCheckbox } from '@/features/item/change-done'
import { ItemSubItemsToggle } from '@/features/item/show-sub-items'
import { ItemOptions } from '@/features/item/options'
import { ItemTimeTrack } from '@/features/item/time-track'
import { useItemList } from '@/widgets/item-list/composable/useItemList'
import { ListTodo } from 'lucide-vue-next'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { ItemList } from '@/widgets/item-list'

const {
  // item,
  filteredItems,
  itemType,
  collections,
  collectionId,
  showAllParams,
  isTimeTracking,
  isHideDone,
  updateItemProperty,
  addItem,
  removeItem,
  toggleShowSubItems,
  hasSubItems,
  resetTimer,
  deleteTimer,
  openDetailsPage,
  filterNestedItems,
} = useItemList()

const { findCollectionTitleById } = useCollections()

const emit = defineEmits<{
  (e: 'toggle-done', ...args: any[]): void
  (e: 'change-title', ...args: any[]): void
  (e: 'change-description', ...args: any[]): void
  (e: 'change-duration-planned', ...args: any[]): void
  (e: 'change-duration-real', ...args: any[]): void
  (e: 'reset-timer', ...args: any[]): void
  (e: 'delete-timer', ...args: any[]): void
  (e: 'change-date', ...args: any[]): void
  (e: 'change-deadline', ...args: any[]): void
  (e: 'change-priority', ...args: any[]): void
  (e: 'switch-collection', ...args: any[]): void
  (e: 'switch-user', ...args: any[]): void
  (e: 'switch-type', ...args: any[]): void
  (e: 'remove', ...args: any[]): void
  (e: 'toggle-show-sub-items', ...args: any[]): void
  (e: 'add-description', ...args: any[]): void
  (e: 'remove-description', ...args: any[]): void
  (e: 'open-details-page', ...args: any[]): void
}>()

const { items, itemIndex } = useItems()

const currentItem = computed(() => items.value.filter((item) => item.id === itemIndex.value)[0])
// const currentItems = computed(() => items.value.filter((item) => item.title.includes('fo')))
// ^ it works

const container = ref<HTMLElement | null>(null)
const isSubForm = ref<boolean>(true)
const isExpandSubItemForm = ref<boolean>(false)
const isExpandItemForm = ref<boolean>(false)

const eal = ref<number>(-10)
const duration = ref<number>(0.15)
const timingFunction = ref<string>('cubic-bezier(0.55, 0, 0.1, 1)')

const transitionString = computed<string>(() => {
  return [
    `max-height ${duration.value}s ${timingFunction.value}`,
    `opacity ${duration.value}s ${timingFunction.value}`,
    `transform ${duration.value}s ${timingFunction.value}`,
  ].join(', ')
})

const transformString = (axis: 'X' | 'Y', value: number) =>
  computed<string>(() => {
    return `translate${axis}(${value}px)`
  })

function beforeEnter(el: Element) {
  const element = el as HTMLElement
  element.style.maxHeight = '0'
  element.style.opacity = '0'
  element.style.overflowY = 'hidden'
  element.style.transform = transformString('Y', eal.value).value
}

function enter(el: Element, done: () => void) {
  const element = el as HTMLElement
  nextTick()
  element.style.transition = transitionString.value
  const height = element.scrollHeight
  element.style.maxHeight = height + 'px'
  element.style.opacity = '1'
  element.style.transform = transformString('Y', 0).value
  element.addEventListener(
    'transitionend',
    () => {
      element.style.maxHeight = 'none'
      element.style.overflowY = 'visible'
      element.style.zIndex = '1'
      done()
    },
    { once: true }
  )
}

function leave(el: Element, done: () => void) {
  const element = el as HTMLElement
  element.style.maxHeight = element.scrollHeight + 'px'
  element.style.opacity = '1'
  element.style.transform = transformString('Y', 0).value
  void element.offsetHeight
  element.style.transition = transitionString.value
  element.style.maxHeight = '0'
  element.style.opacity = '0'
  element.style.overflowY = 'hidden'
  element.style.transform = transformString('Y', eal.value).value
  element.addEventListener('transitionend', done, { once: true })
}

const handleToggle = (showSubs: boolean) => {
  toggleShowSubItems(currentItem.value)
  if (!showSubs) {
    isExpandSubItemForm.value = false
    isExpandItemForm.value = false
  }
}

const showInfo = ref<boolean>(false)
const savedIsHideDoneState = localStorage.getItem('isHideDoneState')
const isHideDoneState = ref<boolean>(
  savedIsHideDoneState ? JSON.parse(savedIsHideDoneState) : false
)

onMounted(() => {
  localStorage.setItem('isHideDoneState', JSON.stringify(isHideDone.value))
  showAllParams.value = true
  isHideDone.value = false
})

onUnmounted(() => {
  showAllParams.value = false
  isHideDone.value = isHideDoneState.value
})
</script>

<template>
  <div class="item-page">
    <div class="flex gap-1.5 items-center">
      <Checkbox
        id="si"
        v-model="showInfo"
      />
      <Label
        style="cursor: pointer"
        for="si"
        >Show info</Label
      >
    </div>
    <div v-if="showInfo">
      <br />
      <br />
      <h1 style="font-size: 20px">{{ currentItem.title }}</h1>
      <h3
        v-if="currentItem.description"
        class="text-muted-foreground"
      >
        {{ currentItem.description }}
      </h3>
      <br />
      <p>id: {{ currentItem.id }}</p>
      <p>userId: {{ currentItem.userId }}</p>
      <p>
        collectionId: {{ currentItem.collectionId }} ({{
          findCollectionTitleById(currentItem.collectionId)
        }})
      </p>
      <p>type: {{ currentItem.type }}</p>
      <p v-if="currentItem.type === 'todo'">isDone: {{ currentItem.isDone || false }}</p>
      <p v-if="currentItem.priority">priority: {{ currentItem.priority }}</p>
      <p v-if="currentItem.durationPlanned">durationPlanned: {{ currentItem.durationPlanned }}</p>
      <p v-if="currentItem.durationReal">durationReal: {{ currentItem.durationReal }}</p>
      <p v-if="currentItem.date">date: {{ currentItem.date }}</p>
      <p v-if="currentItem.deadline">deadline: {{ currentItem.deadline }}</p>
      <p>createdAt: {{ new Date(currentItem.createdAt).toLocaleString() }}</p>
      <p>editedAt: {{ new Date(currentItem.editedAt).toLocaleString() }}</p>
    </div>
    <br />

    <div class="item-list">
      <ItemEntity
        v-if="currentItem"
        v-for="item in items.filter((item) => item.id === itemIndex)"
        :key="item.id"
        :showParams="
          !!(
            item.date ||
            item.deadline ||
            item.durationPlanned ||
            item.durationReal !== null ||
            (item.tags && item.tags.length > 0) ||
            showAllParams
          )
        "
      >
        <template
          #subItemsToggle
          v-if="hasSubItems(item.id) || item.showSubItems"
        >
          <ItemSubItemsToggle
            :model-value="item.showSubItems"
            @update:model-value="handleToggle(item.showSubItems ?? false)"
          />
        </template>
        <template
          v-if="item.type !== 'note'"
          #checkbox
        >
          <ItemCheckbox
            :itemId="item.id"
            :priority="item.priority"
            :model-value="item.isDone"
            @update:model-value="
              updateItemProperty(item, {
                isDone: !item.isDone,
                doneAt: item.isDone ? null : new Date(Date.now()),
              })
            "
          />
        </template>
        <template #title>
          <ItemTitle
            :is-done="item.isDone"
            :title="item.title"
            @save="updateItemProperty(item, { title: $event })"
          />
        </template>
        <template
          v-if="item.description !== null"
          #description
        >
          <ItemDescription
            :description="item.description"
            @save="updateItemProperty(item, { description: $event })"
          />
        </template>
        <template
          v-if="showAllParams || item.durationReal !== null || item.durationPlanned"
          #timeTrack
        >
          <ItemTimeTrack
            :item="item"
            :model-value="isTimeTracking"
            @change-duration-planned="updateItemProperty(item, { durationPlanned: $event })"
            @change-duration-real="updateItemProperty(item, { durationReal: $event })"
            @reset-timer="resetTimer(item)"
            @remove-timer="deleteTimer(item)"
          />
        </template>
        <template
          v-if="showAllParams || item.date"
          #date
        >
          <ItemDate
            :model-value="new Date(item.date ?? 0).getTime()"
            @change="updateItemProperty(item, { date: $event })"
          />
        </template>
        <template
          v-if="showAllParams || item.deadline"
          #deadline
        >
          <ItemDeadline
            :model-value="new Date(item.deadline ?? 0).getTime()"
            @change="updateItemProperty(item, { deadline: $event })"
          />
        </template>
        <template
          v-if="showAllParams || item.priority"
          #priority
        >
          <ItemPriority
            :model-value="item.priority"
            @update:model-value="updateItemProperty(item, { priority: $event })"
          />
        </template>
        <template
          v-if="showAllParams || (item.tags && item.tags.length > 0)"
          #tags
        >
          <ItemTags
            :tags="item.tags"
            @change="updateItemProperty(item, { tags: $event })"
          />
        </template>
        <template
          v-if="item.showSubItems"
          #default
        >
          <Toggle v-model="isSubForm">
            <ListTodo :class="isSubForm ? 'text-foreground' : 'text-muted-foreground'" />
          </Toggle>
        </template>
        <template #options>
          <ItemOptions
            :item="item"
            :collections="collections"
            :hasSubItems="hasSubItems(item.id)"
            :model-value:collectionId="item.collectionId"
            @switch-collection="
              updateItemProperty(
                item,
                { collectionId: $event, parentItemId: null },
                { withChildren: true }
              )
            "
            @switch-user="
              updateItemProperty(
                item,
                { userId: $event.userId, collectionId: $event.colId, parentItemId: null },
                { withChildren: true }
              )
            "
            @switch-type="
              updateItemProperty(
                item,
                { type: item.type === 'todo' ? 'note' : 'todo', parentItemId: null },
                { withChildren: true }
              )
            "
            @remove="removeItem(item)"
            @add-description="updateItemProperty(item, { description: '' })"
            @remove-description="updateItemProperty(item, { description: null })"
            :model-value:date="item.date"
            @change-date="updateItemProperty(item, { date: $event })"
            :model-value:deadline="item.deadline"
            @change-deadline="updateItemProperty(item, { deadline: $event })"
            :model-value:priority="item.priority"
            @change-priority="updateItemProperty(item, { priority: $event })"
            @change-duration-planned="updateItemProperty(item, { durationPlanned: $event })"
            @reset-timer="resetTimer(item)"
            @remove-timer="deleteTimer(item)"
            @open-details-page="openDetailsPage(item)"
            @toggle-sub-item-form="toggleShowSubItems(item)"
          />
        </template>
        <template #subItems>
          <Transition
            name="sub-fade"
            v-bind:css="false"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
          >
            <div
              v-show="item.showSubItems"
              class="sub-items-container"
              ref="container"
            >
              <TransitionGroup name="fade-list">
                <div
                  v-for="subItem in filterNestedItems(filteredItems, item.id)"
                  :key="subItem.id"
                  class="sub-item"
                >
                  <ItemList
                    :item="subItem"
                    :filtered-items="filteredItems"
                    :collections="collections"
                    :item-type="itemType"
                    :show-all-params="showAllParams"
                    :is-time-tracking="isTimeTracking"
                    :has-sub-items="hasSubItems"
                    :filter-nested-items="filterNestedItems"
                    @toggle-done="(...args: any) => emit('toggle-done', ...args)"
                    @change-title="(...args: any) => emit('change-title', ...args)"
                    @change-description="(...args: any) => emit('change-description', ...args)"
                    @change-duration-planned="
                      (...args: any) => emit('change-duration-planned', ...args)
                    "
                    @change-duration-real="(...args: any) => emit('change-duration-real', ...args)"
                    @delete-timer="(...args: any) => emit('delete-timer', ...args)"
                    @change-date="(...args: any) => emit('change-date', ...args)"
                    @change-deadline="(...args: any) => emit('change-deadline', ...args)"
                    @change-priority="(...args: any) => emit('change-priority', ...args)"
                    @switch-collection="(...args: any) => emit('switch-collection', ...args)"
                    @switch-user="(...args: any) => emit('switch-user', ...args)"
                    @switch-type="(...args: any) => emit('switch-type', ...args)"
                    @remove="(...args: any) => emit('remove', ...args)"
                    @toggle-show-sub-items="
                      (...args: any) => emit('toggle-show-sub-items', ...args)
                    "
                    @add-description="(...args: any) => emit('add-description', ...args)"
                    @remove-description="(...args: any) => emit('remove-description', ...args)"
                    @open-details-page="(...args: any) => emit('open-details-page', ...args)"
                  />
                </div>
                <AddItemFormInline
                  subForm
                  v-show="isSubForm"
                  v-model:type="itemType"
                  v-model:isExpand="isExpandItemForm"
                  key="add-sub-item-form"
                  @submit="
                    addItem(
                      collectionId ?? 0,
                      $event.itemTitle,
                      itemType,
                      item.id,
                      $event.description,
                      $event.deadline,
                      $event.date,
                      $event.priority,
                      $event.durationPlanned,
                      $event.tags
                    )
                  "
                />
              </TransitionGroup>
            </div>
          </Transition>
        </template>
      </ItemEntity>
    </div>
  </div>
</template>

<style lang="scss">
.item-page {
  padding-top: 2rem;
  width: 70vw;
}
</style>
