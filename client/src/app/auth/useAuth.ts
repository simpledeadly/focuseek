import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  persist: true,
  state: () => ({
    userId: null as number | null,
    username: null as string | null,
  }),
  getters: {
    getUserId: (state) => state.userId,
    getUsername: (state) => state.username,
  },
  actions: {
    setUserId(id: number) {
      this.userId = id
      console.log('setUserId:', this.$state.userId, this.userId)
    },
    setUsername(username: string) {
      this.username = username
      console.log('setUsername:', this.$state.username, this.username)
    },
  },
})
