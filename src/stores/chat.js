import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getConversationList, createConversation, deleteConversation as deleteConversationApi, pinConversation, markConversationRead } from '@/api/conversation'
import { getAiCharacterById } from '@/api/aiCharacter'
import { sendMessage as sendMessageApi, getMessageList } from '@/api/message'
import websocket from '@/utils/websocket'

export const useChatStore = defineStore('chat', () => {
  // 会话列表
  const conversations = ref([])
  // 当前选中的会话
  const currentConversation = ref(null)
  // 消息列表（按会话ID存储）
  const messages = ref({})
  // 搜索关键词
  const searchKeyword = ref('')
  // 加载状态
  const loading = ref(false)
  // AI角色信息缓存
  const characterCache = ref({})
  // WebSocket消息处理器
  let wsMessageHandler = null

  // 过滤后的会话列表
  const filteredConversations = computed(() => {
    if (!searchKeyword.value) return conversations.value
    const keyword = searchKeyword.value.toLowerCase()
    return conversations.value.filter(conv => 
      conv.name?.toLowerCase().includes(keyword) ||
      conv.lastMessage?.toLowerCase().includes(keyword)
    )
  })

  // 当前会话的消息
  const currentMessages = computed(() => {
    if (!currentConversation.value) return []
    return messages.value[currentConversation.value.id] || []
  })

  // 未读消息总数
  const totalUnread = computed(() => {
    return conversations.value.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
  })

  // 加载会话列表
  const loadConversations = async () => {
    try {
      loading.value = true
      const data = await getConversationList()
      
      // 为每个会话加载AI角色信息
      const conversationsWithCharacter = await Promise.all(
        data.map(async (conv) => {
          let character = characterCache.value[conv.characterId]
          if (!character) {
            try {
              character = await getAiCharacterById(conv.characterId)
              characterCache.value[conv.characterId] = character
            } catch (error) {
              console.error('加载角色信息失败:', error)
              character = {
                name: '未知角色',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
              }
            }
          }
          
          return {
            ...conv,
            name: character.name,
            avatar: character.avatar,
            relationship: character.relationship,
            online: false,
            // 使用后端返回的最后一条消息，如果没有则显示默认文本
            lastMessage: conv.lastMessage || '开始聊天吧~',
            lastTime: conv.lastMessageTime || conv.createdAt,
            unread: 0,
            type: 'single'
          }
        })
      )
      
      conversations.value = conversationsWithCharacter
    } catch (error) {
      console.error('加载会话列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 加载消息列表
  const loadMessages = async (conversationId) => {
    try {
      loading.value = true
      const result = await getMessageList(conversationId, 1, 50)
      
      // 转换消息格式
      const formattedMessages = (result.records || []).map(msg => ({
        id: msg.id,
        conversationId: msg.conversationId,
        content: msg.content,
        type: 'text',
        sender: msg.senderType === 'user' ? 'self' : 'other',
        timestamp: msg.createdAt,
        status: msg.senderType === 'user' ? 'sent' : 'received'
      }))
      
      messages.value[conversationId] = formattedMessages
      return formattedMessages
    } catch (error) {
      console.error('加载消息列表失败:', error)
      // 如果加载失败，初始化为空数组
      if (!messages.value[conversationId]) {
        messages.value[conversationId] = []
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  // 选择会话
  const selectConversation = (conversation) => {
    currentConversation.value = conversation
    // 清除未读
    const conv = conversations.value.find(c => c.id === conversation.id)
    if (conv) {
      conv.unread = 0
    }
    // 加载消息
    loadMessages(conversation.id)
  }

  // 发送消息
  const sendMessage = async (content, type = 'text', extraData = {}) => {
    if (!currentConversation.value || !content.trim()) return

    // 创建临时消息（立即显示在界面上）
    const tempMessage = {
      id: 'temp_' + Date.now(),
      conversationId: currentConversation.value.id,
      content: content.trim(),
      type,
      sender: 'self',
      timestamp: new Date().toISOString(),
      status: 'sending',
      ...extraData
    }

    // 添加到消息列表
    if (!messages.value[currentConversation.value.id]) {
      messages.value[currentConversation.value.id] = []
    }
    messages.value[currentConversation.value.id].push(tempMessage)

    // 更新会话最后消息
    const conv = conversations.value.find(c => c.id === currentConversation.value.id)
    if (conv) {
      conv.lastMessage = content.trim()
      conv.lastTime = tempMessage.timestamp
    }

    try {
      // 调用后端API发送消息
      const messageData = {
        conversationId: currentConversation.value.id,
        content: content.trim(),
        messageType: type,
        fileUrl: extraData.fileUrl,
        fileSize: extraData.fileSize,
        duration: extraData.duration
      }
      
      const result = await sendMessageApi(messageData)
      
      // 更新临时消息为真实消息
      const msgList = messages.value[currentConversation.value.id]
      const index = msgList.findIndex(m => m.id === tempMessage.id)
      if (index > -1) {
        msgList[index] = {
          id: result.id,
          conversationId: result.conversationId,
          content: result.content,
          type: result.messageType || 'text',
          sender: 'self',
          timestamp: result.createdAt,
          status: 'sent',
          fileUrl: result.fileUrl,
          fileSize: result.fileSize,
          duration: result.duration
        }
      }
      
      return msgList[index]
    } catch (error) {
      console.error('发送消息失败:', error)
      // 标记消息发送失败
      const msgList = messages.value[currentConversation.value.id]
      const index = msgList.findIndex(m => m.id === tempMessage.id)
      if (index > -1) {
        msgList[index].status = 'failed'
      }
      throw error
    }
  }

  // 接收AI回复消息（用于WebSocket或轮询）
  const receiveMessage = (message) => {
    if (!message || !message.conversationId) return
    
    const formattedMessage = {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      type: 'text',
      sender: message.senderType === 'user' ? 'self' : 'other',
      timestamp: message.createdAt,
      status: 'received'
    }
    
    // 添加到对应会话的消息列表
    if (!messages.value[message.conversationId]) {
      messages.value[message.conversationId] = []
    }
    messages.value[message.conversationId].push(formattedMessage)
    
    // 更新会话最后消息
    const conv = conversations.value.find(c => c.id === message.conversationId)
    if (conv) {
      conv.lastMessage = message.content
      conv.lastTime = message.createdAt
      // 如果不是当前会话，增加未读数（前端本地计数）
      if (currentConversation.value?.id !== message.conversationId) {
        conv.unread = (conv.unread || 0) + 1
      }
    }
    
    return formattedMessage
  }

  // 搜索会话
  const setSearchKeyword = (keyword) => {
    searchKeyword.value = keyword
  }

  // 创建会话
  const createNewConversation = async (characterId) => {
    try {
      // 检查是否已存在与该角色的会话
      const existingConv = conversations.value.find(c => c.characterId === characterId)
      if (existingConv) {
        // 如果已存在，直接返回该会话
        return existingConv
      }
      
      // 不存在则创建新会话
      const data = await createConversation(characterId)
      await loadConversations()
      return data
    } catch (error) {
      console.error('创建会话失败:', error)
      throw error
    }
  }

  // 删除会话
  const deleteConversation = async (conversationId) => {
    try {
      await deleteConversationApi(conversationId)
      const index = conversations.value.findIndex(c => c.id === conversationId)
      if (index > -1) {
        conversations.value.splice(index, 1)
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value = null
        }
        delete messages.value[conversationId]
      }
    } catch (error) {
      console.error('删除会话失败:', error)
      throw error
    }
  }

  // 置顶会话
  const togglePin = async (conversationId, pinned) => {
    try {
      await pinConversation(conversationId, pinned)
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) {
        conv.isPinned = pinned !== undefined ? pinned : !conv.isPinned
      }
      // 重新排序
      conversations.value.sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return b.isPinned ? 1 : -1
        }
        return new Date(b.lastTime) - new Date(a.lastTime)
      })
    } catch (error) {
      console.error('置顶会话失败:', error)
      throw error
    }
  }

  // 标记已读
  const markRead = async (conversationId) => {
    try {
      await markConversationRead(conversationId)
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) {
        conv.unread = 0
        conv.unreadCount = 0
      }
    } catch (error) {
      console.error('标记已读失败:', error)
      throw error
    }
  }

  // 初始化WebSocket连接
  const initWebSocket = (token) => {
    if (!token) return
    
    // 移除旧的处理器
    if (wsMessageHandler) {
      websocket.offMessage(wsMessageHandler)
    }
    
    // 注册新的消息处理器
    wsMessageHandler = (data) => {
      // 处理不同类型的WebSocket消息
      if (data.type === 'TEXT' && data.content) {
        // AI文本消息
        const message = {
          id: data.messageId,
          conversationId: data.conversationId,
          senderType: data.senderType,
          content: data.content,
          createdAt: data.createdAt
        }
        receiveMessage(message)
      } else if (data.type === 'STATUS') {
        // 状态消息（如"正在输入..."）
        // 可以在这里处理输入状态提示
        console.log('Status update:', data)
      } else if (data.type === 'PONG') {
        // 心跳响应
        console.log('Received PONG')
      }
    }
    
    websocket.onMessage(wsMessageHandler)
    websocket.connect(token)
  }

  // 断开WebSocket连接
  const disconnectWebSocket = () => {
    if (wsMessageHandler) {
      websocket.offMessage(wsMessageHandler)
      wsMessageHandler = null
    }
    websocket.close()
  }

  // 检查WebSocket是否已连接
  const isWebSocketConnected = () => {
    return websocket.isConnected()
  }

  return {
    conversations,
    currentConversation,
    messages,
    searchKeyword,
    loading,
    characterCache,
    filteredConversations,
    currentMessages,
    totalUnread,
    loadConversations,
    loadMessages,
    selectConversation,
    sendMessage,
    receiveMessage,
    setSearchKeyword,
    createNewConversation,
    deleteConversation,
    togglePin,
    markRead,
    initWebSocket,
    disconnectWebSocket,
    isWebSocketConnected
  }
})
