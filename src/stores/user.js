import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: '',
    username: '',
    nickname: '',
    avatar: '',
    email: '',
    phone: '',
    status: 'online',
    signature: ''
  })

  const isLoggedIn = computed(() => !!user.value.id)

  const setUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const loadUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      user.value = JSON.parse(stored)
    }
  }

  const logout = () => {
    user.value = {
      id: '',
      username: '',
      nickname: '',
      avatar: '',
      email: '',
      phone: '',
      status: 'online',
      signature: ''
    }
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const updateStatus = (status) => {
    user.value.status = status
  }

  return {
    user,
    isLoggedIn,
    setUser,
    loadUser,
    logout,
    updateStatus
  }
})
