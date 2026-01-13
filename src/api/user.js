import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - { username, password }
 * @returns {Promise} - { token, userId, username }
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - { username, password, email }
 * @returns {Promise} - UserVO
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取当前登录用户信息
 * @returns {Promise} - UserVO
 */
export function getCurrentUser() {
  return request({
    url: '/auth/current',
    method: 'get'
  })
}

/**
 * 修改用户信息
 * @param {Object} data - { email, avatar, ... }
 * @returns {Promise} - UserVO
 */
export function updateUserInfo(data) {
  return request({
    url: '/auth/update',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 * @param {Object} data - { oldPassword, newPassword }
 * @returns {Promise}
 */
export function updatePassword(data) {
  return request({
    url: '/auth/password',
    method: 'put',
    data
  })
}

/**
 * 上传用户头像
 * @param {File} file - 头像文件
 * @returns {Promise<string>} - 返回头像URL
 */
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/auth/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
