<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  removeButton: () => unknown
  typeSelect?: () => unknown
  timeLeft?: () => unknown
  showSubtodosToggle?: () => unknown
  subtodos?: () => unknown
}>()
</script>

<template>
  <div class="collection-entity flex collections-center space-x-4 rounded-md border p-2">
    <div class="collection-entity__row">
      <div class="collection-entity__row_part">
        <div
          v-if="slots.checkbox"
          class="collection-entity__checkbox"
        >
          <slot name="checkbox" />
        </div>
        <div class="collection-entity__title">
          <slot name="title" />
        </div>
      </div>
      <div class="collection-entity__row_part">
        <div class="collection-entity__timeLeft">
          <slot name="timeLeft" />
        </div>
        <div
          v-if="slots.showSubtodosToggle"
          class="collection-entity__show-todos-toggle"
        >
          <slot name="showSubtodosToggle" />
        </div>
        <div class="collection-entity__remove-button">
          <slot name="removeButton" />
        </div>
        <div
          v-if="slots.typeSelect"
          class="collection-entity__type-select"
        >
          <slot name="typeSelect" />
        </div>
      </div>
    </div>
    <ul
      v-if="slots.subtodos"
      class="collection-entity__subtodos-list"
    >
      <slot name="subtodos" />
    </ul>
  </div>
</template>

<style lang="scss">
.collection-entity {
  background: hsl(var(--primary-foreground));
  border-bottom: none;
  border-radius: 0;

  &__row {
    display: flex;
    flex-direction: row;
    gap: calc(var(--radius) * 2);
    align-collections: center;
    justify-content: space-between;
    width: 100%;

    &_part {
      display: flex;
      flex-direction: row;
      gap: calc(var(--radius) - 2px);
      align-collections: center;
    }
  }

  &__timeLeft {
    display: flex;
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
