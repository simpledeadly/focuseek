<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Collection, CollectionEntity, useCollections } from '@/entities/collection'
import { AddCollectionForm, useAddCollection } from '@/features/collection/add'
import { CollectionTitle, useChangeCollectionTitle } from '@/features/collection/change-title'
import { CollectionRemoveButton, useRemoveCollection } from '@/features/collection/remove'

const emit = defineEmits<{
  (e: 'collections', value: Collection[]): void
}>()

const router = useRouter()

const { collections } = useCollections()
const { addCollection } = useAddCollection(collections)
const { changeCollectionTitle } = useChangeCollectionTitle(collections)
const { removeCollection } = useRemoveCollection(collections)

setTimeout(() => {
  emit('collections', collections.value)
}, 50)
</script>

<template>
  <div class="collections-page">
    <AddCollectionForm @submit="addCollection($event)" />

    <Separator
      :label="collections.length === 0 ? 'No collections' : collections.length + ' collections'"
      style="margin-bottom: 2rem"
    />

    <TransitionGroup name="fade">
      <CollectionEntity
        v-for="col in collections"
        :key="col.id"
      >
        <template #title>
          <CollectionTitle
            :title="col.title"
            @save="changeCollectionTitle(col, $event)"
          />
        </template>
        <template #removeButton>
          <CollectionRemoveButton
            :collection="col"
            @remove="removeCollection(col)"
          />
        </template>
        <template #typeSelect>
          <Button @click="router.push(`/${col.title.toLocaleString().toLocaleLowerCase()}`)"
            >Go to</Button
          >
        </template>
      </CollectionEntity>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.collections-page {
  /** keep */
}
</style>
