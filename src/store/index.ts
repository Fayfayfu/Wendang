import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    user: (() => {
      try {
        const saved = localStorage.getItem('wendang_user')
        if (!saved) return null
        const userData = JSON.parse(saved)
        // Ensure default values for demo
        return {
          id: 'user_1',
          nickname: 'Felix',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
          score: 98,
          isVip: false,
          balance: 158.0,
          level: 1,
          ...userData
        }
      } catch (e) {
        return null
      }
    })() as any,
    theme: 'light',
    ownedDocuments: [] as string[],
    ownedCollections: [] as string[],
    acceptedTasks: [] as string[]
  }),
  actions: {
    setUser(user: any) {
      this.user = user
      localStorage.setItem('wendang_user', JSON.stringify(user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('wendang_user')
    },
    purchaseDocument(id: string) {
      if (!this.ownedDocuments.includes(id)) {
        this.ownedDocuments.push(id)
      }
    },
    purchaseCollection(id: string) {
      if (!this.ownedCollections.includes(id)) {
        this.ownedCollections.push(id)
      }
    },
    acceptTask(id: string) {
      if (!this.acceptedTasks.includes(id)) {
        this.acceptedTasks.push(id)
      }
    }
  }
})
