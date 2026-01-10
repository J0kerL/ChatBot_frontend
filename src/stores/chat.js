import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockConversations, mockMessages } from '@/mock/data'

export const useChatStore = defineStore('chat', () => {
  // 会话列表
  const conversations = ref([])
  // 当前选中的会话
  const currentConversation = ref(null)
  // 消息列表（按会话ID存储）
  const messages = ref({})
  // 搜索关键词
  const searchKeyword = ref('')

  // 过滤后的会话列表
  const filteredConversations = computed(() => {
    if (!searchKeyword.value) return conversations.value
    const keyword = searchKeyword.value.toLowerCase()
    return conversations.value.filter(conv => 
      conv.name.toLowerCase().includes(keyword) ||
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
    return conversations.value.reduce((sum, conv) => sum + (conv.unread || 0), 0)
  })

  // 加载会话列表
  const loadConversations = () => {
    // 这里后续替换为真实API调用
    conversations.value = mockConversations
  }

  // 加载消息列表
  const loadMessages = (conversationId) => {
    // 这里后续替换为真实API调用
    if (!messages.value[conversationId]) {
      messages.value[conversationId] = mockMessages[conversationId] || []
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
  const sendMessage = (content, type = 'text') => {
    if (!currentConversation.value || !content.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      conversationId: currentConversation.value.id,
      content: content.trim(),
      type,
      sender: 'self',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    // 添加到消息列表
    if (!messages.value[currentConversation.value.id]) {
      messages.value[currentConversation.value.id] = []
    }
    messages.value[currentConversation.value.id].push(newMessage)

    // 更新会话最后消息
    const conv = conversations.value.find(c => c.id === currentConversation.value.id)
    if (conv) {
      conv.lastMessage = content.trim()
      conv.lastTime = newMessage.timestamp
    }

    // 模拟对方回复
    setTimeout(() => {
      simulateReply()
    }, 1000 + Math.random() * 2000)

    return newMessage
  }

  // 模拟回复
  const simulateReply = () => {
    if (!currentConversation.value) return

    const replies = [
      '好的，收到！',
      '明白了~',
      '没问题！',
      '我看看...',
      '稍等一下哦',
      '这个想法不错！',
      '好的，我知道了',
      '收到，我处理一下',
      '嗯嗯，好的',
      '了解了，谢谢！'
    ]

    const replyMessage = {
      id: Date.now().toString(),
      conversationId: currentConversation.value.id,
      content: replies[Math.floor(Math.random() * replies.length)],
      type: 'text',
      sender: 'other',
      timestamp: new Date().toISOString(),
      status: 'received'
    }

    messages.value[currentConversation.value.id].push(replyMessage)

    // 更新会话
    const conv = conversations.value.find(c => c.id === currentConversation.value.id)
    if (conv) {
      conv.lastMessage = replyMessage.content
      conv.lastTime = replyMessage.timestamp
    }
  }

  // 搜索会话
  const setSearchKeyword = (keyword) => {
    searchKeyword.value = keyword
  }

  // 删除会话
  const deleteConversation = (conversationId) => {
    const index = conversations.value.findIndex(c => c.id === conversationId)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value = null
      }
      delete messages.value[conversationId]
    }
  }

  return {
    conversations,
    currentConversation,
    messages,
    searchKeyword,
    filteredConversations,
    currentMessages,
    totalUnread,
    loadConversations,
    loadMessages,
    selectConversation,
    sendMessage,
    setSearchKeyword,
    deleteConversation
  }
})
