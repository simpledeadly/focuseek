<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  removeButton: () => unknown
  typeSelect?: () => unknown
  showTodosToggle?: () => unknown
  default?: () => unknown
}>()
</script>

<template>
  <div class="item-entity">
    <div class="item-entity_row">
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
      <div
        v-if="slots.showTodosToggle"
        class="item-entity__show-todos-toggle"
      >
        <slot name="showTodosToggle" />
      </div>
      <div
        v-if="slots.typeSelect"
        class="item-entity__type-select"
      >
        <slot name="typeSelect" />
      </div>
    </div>
    <ul class="item-entity__subtodos-list">
      <slot />
    </ul>
  </div>
</template>

<style lang="scss">
.item-entity {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &_row {
    display: flex;
    flex-direction: row;
  }
}
</style>
