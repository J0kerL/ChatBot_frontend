import request from '@/utils/request'

/**
 * 发送消息
 * @param {object} data - 消息数据
 * @param {number} data.conversationId - 会话ID
 * @param {string} data.content - 消息内容
 * @param {string} data.messageType - 消息类型（text/image/voice/emoji）
 * @param {string} data.fileUrl - 文件地址（可选）
 * @param {number} data.fileSize - 文件大小（可选）
 * @param {number} data.duration - 语音时长（可选）
 */
export const sendMessage = (data) => {
  return request({
    url: '/message/send',
    method: 'post',
    data
  })
}

/**
 * 获取消息列表
 * @param {number} conversationId - 会话ID
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页数量
 */
export const getMessageList = (conversationId, pageNum = 1, pageSize = 20) => {
  return request({
    url: '/message/list',
    method: 'get',
    params: {
      conversationId,
      pageNum,
      pageSize
    }
  })
}
