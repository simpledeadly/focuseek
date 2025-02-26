import { defineStore } from 'pinia'

export const useLoading = defineStore('loader', {
  // persist: true,
  state: () => ({
    loading: false as boolean
  }),
  getters: {
    isLoadingHook: (state) => state.loading
  },
  actions: {
    setLoading(bool: boolean) {
      this.loading = bool
      console.log('setLoading:', this.$state.loading, this.loading)
    },
  },
})
