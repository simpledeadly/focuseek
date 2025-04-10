<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  removeButton: () => unknown
  typeSelect?: () => unknown
  timeLeft?: () => unknown
  showSubItemsToggle?: () => unknown
  subItems?: () => unknown
}>()
</script>

<template>
  <div class="item-entity flex items-center space-x-4 rounded-md border pt-2 pb-2">
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
          v-if="slots.showSubItemsToggle"
          class="item-entity__show-todos-toggle"
        >
          <slot name="showSubItemsToggle" />
        </div>
        <div class="item-entity__timeLeft">
          <slot name="timeLeft" />
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
  </div>
  <ul
    v-if="slots.subItems"
    class="subitems-list"
  >
    <slot name="subItems" />
  </ul>
</template>

<style lang="scss">
.item-entity {
  // background: hsl(var(--primary-foreground));
  border: none;
  border-bottom: 1px solid hsl(var(--border));
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

  &__timeLeft {
    display: flex;
  }

  &__checkbox {
    display: flex;
    opacity: 0.8;
  }

  &:first-child {
    // border-top-left-radius: calc(var(--radius) - 2px);
    // border-top-right-radius: calc(var(--radius) - 2px);
  }

  &:last-child {
    border-bottom: 1px solid hsl(var(--border));
    // border-bottom-right-radius: calc(var(--radius) - 2px);
    // border-bottom-left-radius: calc(var(--radius) - 2px);
  }
}

.subitems-list {
  margin-left: 1.5rem;

  * {
    // border-radius: 0 !important;
  }
}
</style>
