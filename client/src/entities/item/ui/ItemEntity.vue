<script setup lang="ts">
const slots = defineSlots<{
  checkbox?: () => unknown
  title: () => unknown
  description?: () => unknown
  typeSelect?: () => unknown
  timeLeft?: () => unknown
  date?: () => unknown
  showSubItemsToggle?: () => unknown
  showItemOptions: () => unknown
  subItems?: () => unknown
  priority?: () => unknown
  durationPlanned?: () => unknown
}>()

const props = defineProps<{
  showParams?: boolean
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
        <div
          class="item-entity__params"
          v-if="props.showParams"
        >
          <div
            class="item-entity__param"
            v-if="slots.date"
          >
            <slot name="date" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.timeLeft"
          >
            <slot name="timeLeft" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.priority"
          >
            <slot name="priority" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.durationPlanned"
          >
            <slot name="durationPlanned" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="slots.showItemOptions"
      class="item-entity__show-item-options"
    >
      <slot name="showItemOptions" />
    </div>
    <ul
      v-if="slots.subItems"
      class="subitems-list"
    >
      <slot name="subItems" />
    </ul>
  </div>
</template>

<style lang="scss">
.item-entity-wrapper {
  position: relative;
  display: block;
}

.item-entity {
  display: flex;
  flex-grow: 1;
  gap: 6px;
  border-bottom: 1px solid hsl(var(--border));

  &__show-subitems-toggle {
    position: absolute;
    left: -1.5rem;
    top: 12px;
    display: flex;
  }

  &__show-item-options {
    position: absolute;
    right: -0rem;
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
  }

  &__params {
    margin-top: 2px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__param {
    display: flex;
    max-width: 8rem;
    cursor: pointer;
  }
}

.subitems-list {
  margin-left: 1.5rem;
}
</style>
