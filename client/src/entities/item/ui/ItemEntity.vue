<script setup lang="ts">
const slots = defineSlots<{
  subItemsToggle?: () => unknown
  checkbox?: () => unknown
  title: () => unknown
  description?: () => unknown
  timeTrack?: () => unknown
  date?: () => unknown
  deadline?: () => unknown
  priority?: () => unknown
  options: () => unknown
  subItems?: () => unknown
  tags?: () => unknown
  default?: () => unknown
}>()

const props = defineProps<{
  showParams?: boolean
}>()
</script>

<template>
  <div class="item-entity-wrapper">
    <div
      v-if="slots.subItemsToggle"
      class="item-entity__sub-items-toggle"
    >
      <slot name="subItemsToggle" />
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
            v-if="slots.timeTrack"
          >
            <slot name="timeTrack" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.date"
          >
            <slot name="date" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.deadline"
          >
            <slot name="deadline" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.priority"
          >
            <slot name="priority" />
          </div>
          <div
            class="item-entity__param"
            v-if="slots.tags"
          >
            <slot name="tags" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="slots.default"
      class="item-entity__options mr-10"
    >
      <slot />
    </div>
    <div
      v-if="slots.options"
      class="item-entity__options"
    >
      <slot name="options" />
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

  &__sub-items-toggle {
    position: absolute;
    left: -1.5rem;
    top: 12px;
    display: flex;
  }

  &__options {
    position: absolute;
    right: 0rem;
    top: 2px;
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
    transition:
      max-height 0.1s ease-in-out,
      opacity 0s ease-in-out;
  }

  &__params {
    margin-top: 2px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
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
