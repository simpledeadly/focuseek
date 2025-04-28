<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { router } from '@/app/router/router'
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/shared/ui/command'
import { useCollections } from '@/entities/collection'
import { Item, useItems } from '@/entities/item'
import { useMagicKeys } from '@vueuse/core'

const { items, setSelectedItem } = useItems()
const { findCollectionTitleById } = useCollections()

const searchQuery = ref('')

watch(searchQuery, (newValue) => (searchQuery.value = newValue))

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return items.value.filter(
    (item) => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query)
  )
})

const isCommandOpen = ref(false)
const keys = useMagicKeys()
const CmdK = keys['Cmd+K']

const handleResultClick = (item: Item) => {
  setSelectedItem(item)
  router.push({
    path: `/${findCollectionTitleById(item.collectionId).toLowerCase()}/${item.id}`,
  })
  searchQuery.value = ''
  isCommandOpen.value = false
}

const handleOpenChange = () => {
  isCommandOpen.value = !isCommandOpen.value
}

watch(CmdK, (v) => {
  if (v) handleOpenChange()
  searchQuery.value = ''
})

const maxHeightPx = 900
const itemHeightPx = 40
const commandListHeight = ref('0px')

watch(
  filteredResults,
  (newResults) => {
    const calculatedHeight = newResults.length * itemHeightPx
    commandListHeight.value = newResults.length
      ? `${Math.min(calculatedHeight, maxHeightPx)}px`
      : '0px'
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <CommandDialog
      :open="isCommandOpen"
      @update:open="handleOpenChange"
    >
      <div>
        <CommandInput
          v-model="searchQuery"
          placeholder="Введите название элемента"
        />
        <CommandList
          class="command-list"
          :style="{ height: commandListHeight }"
        >
          <CommandGroup v-if="isCommandOpen">
            <div>
              <CommandItem
                v-for="result in filteredResults"
                :key="result.id"
                :value="result.title"
                @mousedown.prevent="handleResultClick(result)"
              >
                <div
                  style="
                    border-bottom: 1px solid hsl(var(--border));
                    width: 100%;
                    padding-bottom: 4px;
                  "
                >
                  {{ result.title }}
                  <br />
                  <i style="color: #aaa">
                    Коллекция: {{ findCollectionTitleById(result.collectionId) }}
                  </i>
                </div>
                <CommandShortcut>{{ result.type }}</CommandShortcut>
              </CommandItem>
            </div>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  </div>
</template>

<style lang="scss">
.command-list {
  overflow-y: auto;
  transition: height 0.1s ease;
  will-change: height;
}
</style>
