<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  removeButton: () => unknown
}>()
</script>

<template>
  <div class="item-entity">
    <div
      v-if="slots.checkbox"
      class="item-entity__checkbox"
    >
      <slot name="checkbox" />
    </div>
    <div class="item-entity__title">
      <slot name="title" />
    </div>
    <div class="item-entity__remove-button">
      <slot name="removeButton" />
    </div>
    <div class="item_entity__type-select">
      <slot name="typeSelect" />
    </div>
  </div>
</template>

<style lang="scss">
.item-entity {
  display: flex;
  gap: 6px;
}
</style>
