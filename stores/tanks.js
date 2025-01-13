import { defineStore } from 'pinia'

export const useTanksStore = defineStore('tanks', {
  state: () => ({
    tanks: [],
    loading: false,
    error: null,
    selectedTank: null
  }),

  getters: {
    getTankById: (state) => (id) => {
      return state.tanks.find(tank => tank.id === id)
    },
    tankOptions: (state) => {
      return state.tanks.map(tank => ({
        id: tank.id,
        name: tank.name
      }))
    }
  },

  actions: {
    async fetchTanks() {
      this.loading = true
      this.error = null
      
      try {
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get('/Stations', {
          params: { stationType: 1 }
        })
        this.tanks = data
      } catch (error) {
        this.error = error.message || 'Failed to fetch tanks'
        console.error('Error fetching tanks:', error)
      } finally {
        this.loading = false
      }
    },

    setSelectedTank(tankId) {
      this.selectedTank = this.getTankById(tankId)
    },

    async updateTankData({ id, baseArea, maxHeight }) {
      this.loading = true
      this.error = null

      try {
        const { $axios } = useNuxtApp()
        await $axios.put(`/Stations/${id}/tank`, {
          baseArea: baseArea,
          maxHeight: maxHeight
        })
        await this.fetchTanks()
      } catch (error) {
        this.error = error.message || 'Failed to update tank'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 