<script setup lang="ts">
import { AddItemForm } from '@/features/item/add'
import { useItemList } from '@/widgets/item-list'

const { activeKey, itemType, addItem } = useItemList()
</script>

<template>
  <div class="form-page item-list">
    <Transition
      name="fade"
      mode="default"
    >
      <div :key="activeKey">
        <AddItemForm
          key="add-item-form"
          v-model:type="itemType"
          @submit="
            addItem(
              $event.collectionId,
              $event.itemTitle,
              $event.itemType,
              $event.parentId,
              $event.description,
              $event.deadline,
              $event.date,
              $event.priority,
              $event.durationPlanned,
              $event.tags
            )
          "
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.item-list {
  margin: 0;
}

.form-page {
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
