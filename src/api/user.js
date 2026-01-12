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
