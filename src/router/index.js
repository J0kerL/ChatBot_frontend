import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/messages'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/Messages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages/:id',
    name: 'ChatDetail',
    component: () => import('@/views/ChatDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('@/views/Contacts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai/add',
    name: 'AddAiCharacter',
    component: () => import('@/views/AddAiCharacter.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai/detail/:id',
    name: 'AiCharacterDetail',
    component: () => import('@/views/AiCharacterDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai/edit/:id',
    name: 'EditAiCharacter',
    component: () => import('@/views/EditAiCharacter.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const validateToken = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }
  try {
    const response = await fetch('/api/auth/current', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) {
      return false
    }
    const data = await response.json()
    return data?.code === 0
  } catch (error) {
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
    const valid = await validateToken()
    if (!valid) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      next('/login')
      return
    }
    next()
    return
  }

  if (to.path === '/login' && isAuthenticated) {
    const valid = await validateToken()
    if (valid) {
      next('/messages')
      return
    }
  }

  next()
})

export default router
