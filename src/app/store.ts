import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useItemsStore = defineStore('test', () => {
  const test = ref<boolean>(false)

  return { test }
})
