import axios from 'axios'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 后端返回的数据格式: { code, msg, data }
    // code: 0 表示成功，1 表示失败
    if (res.code === 0) {
      return res.data
    } else {
      // 业务错误，返回后端的实际错误信息
      return Promise.reject(new Error(res.msg || '操作失败'))
    }
  },
  error => {
    // HTTP错误处理
    if (error.response) {
      const { status, data } = error.response
      // 优先使用后端返回的错误信息
      const errorMsg = data?.msg || data?.message
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转登录
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
          router.push('/login')
          return Promise.reject(new Error(errorMsg || '登录已过期，请重新登录'))
        case 403:
          return Promise.reject(new Error(errorMsg || '没有权限访问'))
        case 404:
          return Promise.reject(new Error(errorMsg || '请求的资源不存在'))
        case 500:
          return Promise.reject(new Error(errorMsg || '服务器内部错误'))
        default:
          return Promise.reject(new Error(errorMsg || '网络请求失败'))
      }
    }
    // 网络错误等情况
    if (error.message?.includes('timeout')) {
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }
    if (error.message?.includes('Network Error')) {
      return Promise.reject(new Error('网络连接失败，请检查网络'))
    }
    return Promise.reject(new Error(error.message || '请求失败'))
  }
)

export default request
