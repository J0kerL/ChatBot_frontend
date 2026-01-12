import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser } from '@/api/user'

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

  const token = ref('')

  const isLoggedIn = computed(() => !!token.value)

  // 初始化 - 从localStorage恢复状态
  const init = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  const setUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const loadUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      user.value = JSON.parse(stored)
    }
  }

  // 登录
  const login = async (loginData) => {
    const res = await loginApi(loginData)
    // res: { token, userId, username }
    setToken(res.token)
    setUser({
      id: res.userId,
      username: res.username,
      nickname: res.username
    })
    // 登录后获取完整用户信息
    await fetchCurrentUser()
    return res
  }

  // 注册
  const register = async (registerData) => {
    const res = await registerApi(registerData)
    return res
  }

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser()
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
      })
      return userData
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 登出
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 无论请求是否成功，都清除本地状态
      token.value = ''
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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    }
  }

  const updateStatus = (status) => {
    user.value.status = status
  }

  // 初始化调用
  init()

  return {
    user,
    token,
    isLoggedIn,
    setUser,
    setToken,
    loadUser,
    login,
    register,
    fetchCurrentUser,
    logout,
    updateStatus
  }
})
