import request from '@/utils/request'

/**
 * 创建会话
 * @param {number} characterId - AI角色ID
 */
export const createConversation = (characterId) => {
  return request({
    url: '/conversation/add',
    method: 'post',
    params: { characterId }
  })
}

/**
 * 获取会话列表
 */
export const getConversationList = () => {
  return request({
    url: '/conversation/list',
    method: 'get'
  })
}

/**
 * 删除会话
 * @param {number} id - 会话ID
 */
export const deleteConversation = (id) => {
  return request({
    url: `/conversation/${id}`,
    method: 'delete'
  })
}

/**
 * 置顶/取消置顶会话
 * @param {number} id - 会话ID
 * @param {boolean} pinned - 是否置顶（可选）
 */
export const pinConversation = (id, pinned) => {
  return request({
    url: `/conversation/${id}/pin`,
    method: 'put',
    params: { pinned }
  })
}

/**
 * 标记会话已读
 * @param {number} id - 会话ID
 */
export const markConversationRead = (id) => {
  return request({
    url: `/conversation/${id}/read`,
    method: 'put'
  })
}

/**
 * 更新会话信息
 * @param {number} id - 会话ID
 * @param {object} data - 更新数据
 */
export const updateConversation = (id, data) => {
  return request({
    url: `/conversation/${id}`,
    method: 'put',
    data
  })
}
