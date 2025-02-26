import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  persist: true,
  state: () => ({
    userId: null as number | null,
  }),
  getters: {
    getUserId: (state) => state.userId
  },
  actions: {
    setUserId(id: number) {
      this.userId = id
      console.log('setUserId 2:', this.$state.userId, this.userId)
    },
  },
})

// export const useAuth = defineStore('auth', () => {
//   const authUserId = shallowRef<number | null>(null)

//   const setUserId = async (id: number) => {
//     try {
//       authUserId.value = id
//       console.log('setUserId 2:', authUserId.value)
//     } catch (error) {
//       console.error('Ошибка при установке userId:', error)
//     }
//   }

//   return { authUserId, setUserId }
// })
