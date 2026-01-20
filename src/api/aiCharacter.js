import request from '@/utils/request'

/**
 * 添加AI角色
 * @param {Object} data - AI角色数据
 * @returns {Promise} - AiCharacterVO
 */
export function addAiCharacter(data) {
  return request({
    url: '/ai/add',
    method: 'post',
    data
  })
}

/**
 * 分页查询AI角色
 * @param {Object} params - { name, pageNum, pageSize }
 * @returns {Promise} - PageResult
 */
export function getAiCharacterPage(params) {
  return request({
    url: '/ai/page',
    method: 'get',
    params
  })
}

/**
 * 查看AI角色详情
 * @param {Number} id - AI角色ID
 * @returns {Promise} - AiCharacterVO
 */
export function getAiCharacterById(id) {
  return request({
    url: `/ai/get/${id}`,
    method: 'get'
  })
}

/**
 * 更新AI角色信息
 * @param {Object} data - UpdateAiCharacterDTO
 * @returns {Promise} - AiCharacterVO
 */
export function updateAiCharacter(data) {
  return request({
    url: '/ai/update',
    method: 'put',
    data
  })
}

/**
 * 删除AI角色
 * @param {Number} id - AI角色ID
 * @returns {Promise}
 */
export function deleteAiCharacter(id) {
  return request({
    url: `/ai/del/${id}`,
    method: 'delete'
  })
}
