<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  description?: () => unknown
  removeButton: () => unknown
  typeSelect?: () => unknown
  timeLeft?: () => unknown
  date?: () => unknown
  showSubItemsToggle?: () => unknown
  subItems?: () => unknown
}>()
</script>

<template>
  <div class="item-entity-wrapper flex items-center">
    <div
      v-if="slots.showSubItemsToggle"
      class="item-entity__show-subitems-toggle"
    >
      <slot name="showSubItemsToggle" />
    </div>

    <div class="item-entity pt-2 pb-2">
      <div
        v-if="slots.checkbox"
        class="item-entity__checkbox"
      >
        <slot name="checkbox" />
      </div>
      <div class="item-entity__column">
        <div class="item-entity__title">
          <slot name="title" />
        </div>
        <div
          class="item-entity__description"
          v-if="slots.description"
        >
          <slot name="description" />
        </div>
        <div class="item-entity__params">
          <div
            class="item-entity__param item-entity__param_timeLeft"
            v-if="slots.timeLeft"
          >
            <slot name="timeLeft" />
          </div>
          <div
            class="item-entity__param item-entity__param_date"
            v-if="slots.date"
          >
            <slot name="date" />
          </div>
          <div class="item-entity__param item-entity__param_remove-button">
            <slot name="removeButton" />
          </div>
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
.item-entity-wrapper {
  position: relative;
}

.item-entity {
  border-bottom: 1px solid hsl(var(--border));
  display: flex;
  flex-grow: 1;
  gap: 6px;

  &__show-subitems-toggle {
    position: absolute;
    left: -1.5rem;
    top: 12px;
    display: flex;
  }

  &__checkbox {
    display: flex;
    margin-top: 4px;
    opacity: 0.8;
  }

  &__column {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 2px;
  }

  &__params {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &:last-child {
    border-bottom: 1px solid hsl(var(--border));
  }
}

.subitems-list {
  margin-left: 1.5rem;
}
</style>
