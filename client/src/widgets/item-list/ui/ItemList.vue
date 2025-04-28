<script setup lang="ts">
import { computed, ref } from 'vue'
import { ItemEntity, useItems, filterNestedItems, Item } from '@/entities/item'
import { AddItemFormInline, useAddItem } from '@/features/item/add'
import { ItemTitle, useChangeItemTitle } from '@/features/item/change-title'
import { ItemDescription, useChangeItemDescription } from '@/features/item/change-description'
import { ItemDeadline, useChangeItemDeadline } from '@/features/item/change-deadline'
import { ItemPriority, useChangeItemPriority } from '@/features/item/change-priority'
import { ItemDate, useChangeItemDate } from '@/features/item/change-date'
import { ItemCheckbox, useDoneItem } from '@/features/item/done'
import { useFilterItems } from '@/features/item/filter'
import { useRemoveItem } from '@/features/item/remove'
import { ItemSubItemsToggle, useShowSubItems } from '@/features/item/show-sub-items'
import { ItemOptions } from '@/features/item/options'
import { useCollections } from '@/entities/collection'
import { useSwitchItemCollection } from '@/features/item/switch-collection'
import { useSwitchItemType } from '@/features/item/switch-type'
import { ItemTimeTrack, useItemTimeTrack } from '@/features/item/time-track'
import { Search } from '@/widgets/search'
import { router } from '@/app/router/router'

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
</script>

<template>
  <Search />
  <div class="item-list">
    <Transition
      name="fade"
      mode="default"
    >
      <div :key="activeKey">
        <TransitionGroup name="fade-list">
          <div
            v-for="(item, index) in filteredParentItems"
            :key="item.id"
            :style="`--index: ${index};`"
            class="item"
          >
            <ItemEntity
              :showParams="
                !item.isDone &&
                !!(
                  item.date ||
                  item.deadline ||
                  item.durationPlanned ||
                  item.durationReal !== null ||
                  showAllParams
                )
              "
            >
              <template
                #subItemsToggle
                v-if="hasSubItems(item.id)"
              >
                <ItemSubItemsToggle
                  :model-value="item.showSubItems"
                  @update:model-value="toggleShowSubItems(item)"
                />
              </template>
              <template
                v-if="itemType !== 'note'"
                #checkbox
              >
                <ItemCheckbox
                  :priority="item.priority"
                  :model-value="item.isDone"
                  @update:model-value="toggleDoneItem(item)"
                />
              </template>
              <template #title>
                <ItemTitle
                  :is-done="item.isDone"
                  :title="item.title"
                  @save="changeItemTitle(item, $event)"
                />
              </template>
              <template
                v-if="item.description !== null"
                #description
              >
                <ItemDescription
                  :description="item.description"
                  @save="changeItemDescription(item, $event)"
                />
              </template>
              <template
                v-if="item.durationReal !== null || item.durationPlanned"
                #timeTrack
              >
                <ItemTimeTrack
                  :item="item"
                  :model-value="isTimeTracking"
                  @change-duration-planned="changeItemDurationPlanned(item, $event)"
                  @change-duration-real="changeItemDurationReal(item, $event)"
                  @change-duration-real-from-options="deleteTimer(item, $event)"
                />
              </template>
              <template
                v-if="showAllParams || item.date"
                #date
              >
                <ItemDate
                  :model-value="item.date"
                  @change="changeItemDate(item, $event)"
                />
              </template>
              <template
                v-if="showAllParams || item.deadline"
                #deadline
              >
                <ItemDeadline
                  :model-value="item.deadline"
                  @change="changeItemDeadline(item, $event)"
                />
              </template>
              <template
                v-if="showAllParams || item.priority"
                #priority
              >
                <ItemPriority
                  :model-value="item.priority"
                  @update:model-value="changeItemPriority(item, $event)"
                />
              </template>
              <template #options>
                <ItemOptions
                  :item="item"
                  :collections="collections"
                  :model-value:collectionId="item.collectionId"
                  @change-collection="switchItemCollection(item, $event)"
                  @change-type="switchItemType(item, item.type === 'todo' ? 'note' : 'todo')"
                  @remove="removeItem(item)"
                  @add-description="changeItemDescription(item, '')"
                  @remove-description="changeItemDescription(item, null)"
                  :model-value:date="item.date"
                  @edit-date="changeItemDate(item, $event)"
                  :model-value:deadline="item.deadline"
                  @edit-deadline="changeItemDeadline(item, $event)"
                  :model-value:priority="item.priority"
                  @edit-priority="changeItemPriority(item, $event)"
                  @change-duration-planned="changeItemDurationPlanned(item, $event)"
                  @change-duration-real="changeItemDurationReal(item, $event)"
                  @change-duration-real-from-opitons="deleteTimer(item, $event)"
                  @open-details-page="openDetailsPage(item)"
                />
              </template>
              <template #subItems>
                <TransitionGroup name="sub-fade">
                  <div
                    v-if="item.showSubItems"
                    class="sub-items-container"
                  >
                    <div
                      v-for="(subItem, index) in filterNestedItems(filteredItems, item.id)"
                      :key="subItem.id"
                      :style="`--index: ${index};`"
                      class="sub-item"
                    >
                      <ItemEntity
                        :showParams="
                          !subItem.isDone &&
                          !!(
                            subItem.date ||
                            subItem.deadline ||
                            subItem.durationPlanned ||
                            subItem.durationReal !== null ||
                            showAllParams
                          )
                        "
                      >
                        <template
                          v-if="hasSubItems(subItem.id)"
                          #subItemsToggle
                        >
                          <ItemSubItemsToggle
                            :model-value="subItem.showSubItems"
                            @update:model-value="toggleShowSubItems(subItem)"
                          />
                        </template>
                        <template
                          v-if="itemType !== 'note'"
                          #checkbox
                        >
                          <ItemCheckbox
                            :priority="subItem.priority"
                            :model-value="subItem.isDone"
                            @update:model-value="toggleDoneItem(subItem)"
                          />
                        </template>
                        <template #title>
                          <ItemTitle
                            :is-done="subItem.isDone"
                            :title="subItem.title"
                            @save="changeItemTitle(subItem, $event)"
                          />
                        </template>
                        <template
                          v-if="subItem.description !== null"
                          #description
                        >
                          <ItemDescription
                            :description="subItem.description"
                            @save="changeItemDescription(subItem, $event)"
                          />
                        </template>
                        <template
                          v-if="subItem.durationReal !== null || subItem.durationPlanned"
                          #timeTrack
                        >
                          <ItemTimeTrack
                            :item="subItem"
                            :model-value="isTimeTracking"
                            @change-duration-planned="changeItemDurationPlanned(subItem, $event)"
                            @change-duration-real="changeItemDurationReal(subItem, $event)"
                            @change-duration-real-from-options="deleteTimer(subItem, $event)"
                          />
                        </template>
                        <template
                          v-if="subItem.date"
                          #date
                        >
                          <ItemDate
                            :model-value="subItem.date"
                            @change="changeItemDate(subItem, $event)"
                          />
                        </template>
                        <template
                          v-if="showAllParams || subItem.deadline"
                          #deadline
                        >
                          <ItemDeadline
                            :model-value="subItem.deadline"
                            @change="changeItemDeadline(subItem, $event)"
                          />
                        </template>
                        <template
                          v-if="showAllParams || subItem.priority"
                          #priority
                        >
                          <ItemPriority
                            :model-value="subItem.priority"
                            @update:model-value="changeItemPriority(subItem, $event)"
                          />
                        </template>
                        <template #options>
                          <ItemOptions
                            :item="subItem"
                            :collections="collections"
                            :model-value:collectionId="subItem.collectionId"
                            @change-collection="switchItemCollection(subItem, $event)"
                            @change-type="
                              switchItemType(subItem, subItem.type === 'todo' ? 'note' : 'todo')
                            "
                            @remove="removeItem(subItem)"
                            @add-description="changeItemDescription(subItem, '')"
                            @remove-description="changeItemDescription(subItem, null)"
                            :model-value:date="subItem.date"
                            @edit-date="changeItemDate(subItem, $event)"
                            :model-value:deadline="subItem.deadline"
                            @edit-deadline="changeItemDeadline(subItem, $event)"
                            :model-value:priority="subItem.priority"
                            @edit-priority="changeItemPriority(subItem, $event)"
                            @change-duration-planned="changeItemDurationPlanned(subItem, $event)"
                            @change-duration-real="changeItemDurationReal(subItem, $event)"
                            @change-duration-real-from-opitons="deleteTimer(subItem, $event)"
                            @open-details-page="openDetailsPage(subItem)"
                          />
                        </template>
                        <template #subItems>
                          <TransitionGroup name="sub-fade">
                            <div
                              v-if="subItem.showSubItems"
                              class="sub-items-container"
                            >
                              <ItemEntity
                                v-for="(subItem2, index) in filterNestedItems(
                                  filteredItems,
                                  subItem.id
                                )"
                                :key="subItem2.id"
                                :style="`--index: ${index};`"
                                class="sub-item"
                                :showParams="
                                  !subItem2.isDone &&
                                  !!(
                                    subItem2.date ||
                                    subItem2.deadline ||
                                    subItem2.durationPlanned ||
                                    subItem2.durationReal !== null ||
                                    showAllParams
                                  )
                                "
                              >
                                <template
                                  #subItemsToggle
                                  v-if="hasSubItems(subItem2.id)"
                                >
                                  <ItemSubItemsToggle
                                    :model-value="subItem2.showSubItems"
                                    @update:model-value="toggleShowSubItems(subItem2)"
                                  />
                                </template>
                                <template
                                  v-if="itemType !== 'note'"
                                  #checkbox
                                >
                                  <ItemCheckbox
                                    :priority="subItem2.priority"
                                    :model-value="subItem2.isDone"
                                    @update:model-value="toggleDoneItem(subItem2)"
                                  />
                                </template>
                                <template #title>
                                  <ItemTitle
                                    :is-done="subItem2.isDone"
                                    :title="subItem2.title"
                                    @save="changeItemTitle(subItem2, $event)"
                                  />
                                </template>
                                <template
                                  v-if="subItem2.description !== null"
                                  #description
                                >
                                  <ItemDescription
                                    :description="subItem2.description"
                                    @save="changeItemDescription(subItem2, $event)"
                                  />
                                </template>
                                <template
                                  v-if="subItem2.durationReal !== null || subItem2.durationPlanned"
                                  #timeTrack
                                >
                                  <ItemTimeTrack
                                    :item="subItem2"
                                    :model-value="isTimeTracking"
                                    @change-duration-planned="
                                      changeItemDurationPlanned(subItem2, $event)
                                    "
                                    @change-duration-real="changeItemDurationReal(subItem2, $event)"
                                    @change-duration-real-from-options="
                                      deleteTimer(subItem2, $event)
                                    "
                                  />
                                </template>
                                <template
                                  v-if="showAllParams || subItem2.date"
                                  #date
                                >
                                  <ItemDate
                                    :model-value="subItem2.date"
                                    @change="changeItemDate(subItem2, $event)"
                                  />
                                </template>
                                <template
                                  v-if="showAllParams || subItem2.deadline"
                                  #deadline
                                >
                                  <ItemDeadline
                                    :model-value="subItem2.deadline"
                                    @change="changeItemDeadline(subItem2, $event)"
                                  />
                                </template>
                                <template
                                  v-if="showAllParams || subItem2.priority"
                                  #priority
                                >
                                  <ItemPriority
                                    :model-value="subItem2.priority"
                                    @update:model-value="changeItemPriority(subItem2, $event)"
                                  />
                                </template>
                                <template #options>
                                  <ItemOptions
                                    :item="subItem2"
                                    :collections="collections"
                                    :model-value:collectionId="subItem2.collectionId"
                                    @change-collection="switchItemCollection(subItem2, $event)"
                                    @change-type="
                                      switchItemType(
                                        subItem2,
                                        subItem2.type === 'todo' ? 'note' : 'todo'
                                      )
                                    "
                                    @remove="removeItem(subItem2)"
                                    @add-description="changeItemDescription(subItem2, '')"
                                    @remove-description="changeItemDescription(subItem2, null)"
                                    :model-value:date="subItem2.date"
                                    @edit-date="changeItemDate(subItem2, $event)"
                                    :model-value:deadline="subItem2.deadline"
                                    @edit-deadline="changeItemDeadline(subItem2, $event)"
                                    :model-value:priority="subItem2.priority"
                                    @edit-priority="changeItemPriority(subItem2, $event)"
                                    @change-duration-planned="
                                      changeItemDurationPlanned(subItem2, $event)
                                    "
                                    @change-duration-real="changeItemDurationReal(subItem2, $event)"
                                    @change-duration-real-from-opitons="
                                      deleteTimer(subItem2, $event)
                                    "
                                    @open-details-page="openDetailsPage(subItem2)"
                                  />
                                </template>
                              </ItemEntity>
                            </div>
                          </TransitionGroup>
                        </template>
                      </ItemEntity>
                    </div>
                  </div>
                </TransitionGroup>
              </template>
            </ItemEntity>
          </div>
          <AddItemFormInline
            v-model:type="itemType"
            key="add-item-form"
            @submit="
              addItem(
                collectionId,
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

.sub-items-container {
  max-height: 3000px; /* Достаточно большой для подэлементов */
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

/** Animation for sub-items list */
.sub-fade-enter-active,
.sub-fade-leave-active {
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

.sub-fade-enter-from,
.sub-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/** Animation for each sub-item */
.sub-item {
  transition:
    opacity 0.2s cubic-bezier(0.55, 0, 0.1, 1),
    transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);
  transition-delay: calc(0.01s * var(--index));
}

.sub-fade-enter-from .sub-item,
.sub-fade-leave-to .sub-item {
  opacity: 0;
  transform: translateY(-4px);
}

// .item {
//   transition:
//     opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1),
//     transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
//   transition-delay: calc(0.05s * var(--index));
// }
</style>
