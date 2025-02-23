<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  removeButton: () => unknown
  typeSelect?: () => unknown
  showSubtodosToggle?: () => unknown
  subtodos?: () => unknown
}>()
</script>

<template>
  <div class="item-entity flex items-center space-x-4 rounded-md border p-2">
    <div class="item-entity__row">
      <div class="item-entity__row_part">
        <div
          v-if="slots.checkbox"
          class="item-entity__checkbox"
        >
          <slot name="checkbox" />
        </div>
        <div class="item-entity__title">
          <slot name="title" />
        </div>
      </div>
      <div class="item-entity__row_part">
        <div
          v-if="slots.showSubtodosToggle"
          class="item-entity__show-todos-toggle"
        >
          <slot name="showSubtodosToggle" />
        </div>
        <div class="item-entity__remove-button">
          <slot name="removeButton" />
        </div>
        <div
          v-if="slots.typeSelect"
          class="item-entity__type-select"
        >
          <slot name="typeSelect" />
        </div>
      </div>
    </div>
    <ul
      v-if="slots.subtodos"
      class="item-entity__subtodos-list"
    >
      <slot name="subtodos" />
    </ul>
  </div>
</template>

<style lang="scss">
.item-entity {
  background: hsl(var(--primary-foreground));
  border-bottom: none;
  border-radius: 0;

  &__row {
    display: flex;
    flex-direction: row;
    gap: calc(var(--radius) * 2);
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &_part {
      display: flex;
      flex-direction: row;
      gap: calc(var(--radius) - 2px);
      align-items: center;
    }
  }

  &__checkbox {
    display: flex;
    opacity: 0.8;
  }

  &:first-child {
    border-top-left-radius: calc(var(--radius) - 2px);
    border-top-right-radius: calc(var(--radius) - 2px);
  }

  &:last-child {
    border-bottom: 1px solid hsl(var(--border));
    border-bottom-right-radius: calc(var(--radius) - 2px);
    border-bottom-left-radius: calc(var(--radius) - 2px);
  }
}
</style>
