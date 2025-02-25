import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  persist: true,
  state: () => ({
    userId: null as number | null,
  }),
  getters: {
    getUserId: (state) => state.userId,
  },
  actions: {
    setUserId(id: number) {
      this.userId = id
    },
  },
})
