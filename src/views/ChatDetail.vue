<template>
  <div class="chat-detail-page">
    <!-- 侧边导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="user-avatar" @click="goToProfile">
          <img :src="userStore.user.avatar || defaultAvatar" :alt="userStore.user.nickname" />
          <span class="status-indicator" :class="userStore.user.status"></span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/messages" class="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">消息</span>
        </router-link>
        
        <router-link to="/contacts" class="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">联系人</span>
        </router-link>
      </nav>
    </aside>

    <!-- 聊天区域 -->
    <main class="chat-area">
      <div v-if="loading" class="loading">加载中...</div>
      
      <template v-else-if="conversation">
        <!-- 聊天头部 -->
        <header class="chat-header">
          <button class="back-btn" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
            </svg>
          </button>
          <div class="chat-info">
            <div class="avatar-wrapper">
              <img :src="conversation.avatar || defaultAvatar" :alt="conversation.name" />
              <span v-if="conversation.online" class="online-dot"></span>
            </div>
            <div class="info">
              <h3>{{ conversation.name }}</h3>
              <span class="status" :class="{ 'typing': isAiTyping }">
                {{ isAiTyping ? '对方正在输入中' : (conversation.relationship || '在线') }}
              </span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" title="更多" @click="showMoreMenu = !showMoreMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- 消息列表 -->
        <div class="messages-container custom-scrollbar" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-messages">
            <p>开始聊天吧~</p>
          </div>
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 
              'message-self': message.sender === 'self',
              'message-sending': message.status === 'sending',
              'message-failed': message.status === 'failed'
            }"
          >
            <div class="message-avatar">
              <img :src="message.sender === 'self' ? userStore.user.avatar : conversation.avatar" />
            </div>
            <div class="message-content">
              <div class="message-bubble">
                {{ message.content }}
                <span v-if="message.status === 'sending'" class="sending-indicator">发送中...</span>
                <span v-if="message.status === 'failed'" class="failed-indicator" @click="resendMessage(message)">
                  发送失败，点击重试
                </span>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-box">
            <textarea 
              v-model="inputMessage"
              placeholder="输入消息..."
              @keydown.enter.exact.prevent="handleSend"
              @keydown.enter.shift.exact="inputMessage += '\n'"
            ></textarea>
            <button class="send-btn" @click="handleSend" :disabled="!inputMessage.trim()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </template>

      <div v-else class="empty-chat">
        <p>会话不存在</p>
        <button class="btn-primary" @click="goBack">返回消息列表</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import toast from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()

const loading = ref(false)
const conversation = ref(null)
const inputMessage = ref('')
const messagesContainer = ref(null)
const showMoreMenu = ref(false)
const isAiTyping = ref(false)
const typingTimeout = ref(null)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

// 直接使用 store 的 computed 属性，保持响应式
const messages = computed(() => chatStore.currentMessages)

onMounted(() => {
  userStore.loadUser()
  loadConversation()
  
  // 初始化WebSocket连接（只在未连接时初始化）
  const token = localStorage.getItem('token')
  if (token && !chatStore.isWebSocketConnected()) {
    chatStore.initWebSocket(token)
  }
})

onUnmounted(() => {
  // 组件卸载时不断开WebSocket，保持连接以接收其他会话的消息
  // chatStore.disconnectWebSocket()
  // 重置输入状态
  isAiTyping.value = false
  // 清除超时定时器
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})

const loadConversation = async () => {
  const conversationId = parseInt(route.params.id)
  if (!conversationId) {
    return
  }
  
  // 切换会话时重置输入状态
  isAiTyping.value = false
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
    typingTimeout.value = null
  }
  
  try {
    loading.value = true
    // 从store中查找会话
    const conv = chatStore.conversations.find(c => c.id === conversationId)
    if (conv) {
      conversation.value = conv
      chatStore.selectConversation(conv)
      // 标记已读
      await chatStore.markRead(conversationId)
      // 加载消息
      await chatStore.loadMessages(conversationId)
      // 不需要赋值，直接使用 computed 的 chatStore.currentMessages
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error) {
    console.error('加载会话失败:', error)
    toast.error('加载会话失败')
  } finally {
    loading.value = false
  }
}

const handleSend = async () => {
  if (!inputMessage.value.trim()) return
  
  const messageContent = inputMessage.value.trim()
  inputMessage.value = ''
  
  try {
    // 清除之前的超时定时器
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
    }
    
    // 显示AI正在输入状态
    isAiTyping.value = true
    
    // 设置超时保护：30秒后自动关闭"正在输入中"
    typingTimeout.value = setTimeout(() => {
      console.log('AI回复超时，自动关闭输入状态')
      isAiTyping.value = false
    }, 30000)
    
    await chatStore.sendMessage(messageContent)
    // 不需要手动赋值，直接使用 chatStore.currentMessages
    
    nextTick(() => {
      scrollToBottom()
    })
    
    // 注意：不在这里关闭 isAiTyping，等待AI回复后再关闭
  } catch (error) {
    console.error('发送消息失败:', error)
    // 发送失败时关闭输入状态
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
    }
    isAiTyping.value = false
    // 显示错误提示
    const errorMsg = error.message || '发送消息失败，请重试'
    toast.error(errorMsg)
    // 恢复输入内容
    inputMessage.value = messageContent
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const goBack = () => {
  router.push('/messages')
}

const goToProfile = () => {
  router.push('/profile')
}

// 重发消息
const resendMessage = async (message) => {
  if (message.status !== 'failed') return
  
  // 移除失败的消息
  const msgList = messages.value
  const index = msgList.findIndex(m => m.id === message.id)
  if (index > -1) {
    msgList.splice(index, 1)
  }
  
  // 重新发送
  inputMessage.value = message.content
  await handleSend()
}

// 监听消息数量变化，自动滚动到底部
watch(() => chatStore.currentMessages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
  
  // 检测AI回复并关闭输入状态
  if (!isAiTyping.value) return
  
  const messages = chatStore.currentMessages
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    // 如果最后一条消息是AI发送的，关闭输入状态
    if (lastMessage && lastMessage.sender === 'other') {
      console.log('检测到AI回复，关闭输入状态', lastMessage)
      // 清除超时定时器
      if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
        typingTimeout.value = null
      }
      isAiTyping.value = false
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

@keyframes typingPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.chat-detail-page {
  display: flex;
  height: 100vh;
  background: $bg-primary;
  overflow: hidden;
  
  @include mobile {
    flex-direction: column;
    background: $white;
  }
}

// 侧边导航栏
.sidebar {
  width: 72px;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  flex-shrink: 0;
  
  @include mobile {
    display: none;
  }
  
  .sidebar-top {
    margin-bottom: 30px;
    
    .user-avatar {
      position: relative;
      cursor: pointer;
      
      img {
        width: 44px;
        height: 44px;
        border-radius: $radius-full;
        border: 2px solid rgba(255, 255, 255, 0.5);
        transition: all $transition-fast;
      }
      
      &:hover img {
        transform: scale(1.05);
        border-color: $white;
      }
      
      .status-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #10b981;
        
        &.online { background: $success-color; }
        &.offline { background: $gray-400; }
        &.busy { background: $error-color; }
        &.away { background: $warning-color; }
      }
    }
  }
  
  .nav-menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-item {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;
    text-decoration: none;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: $white;
    }
    
    &.active {
      background: rgba(255, 255, 255, 0.2);
      color: $white;
    }
    
    .nav-label {
      font-size: 10px;
      margin-top: 2px;
    }
  }
}

// 聊天区域
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: $white;
  min-width: 0;
  
  @include mobile {
    width: 100%;
    height: 100vh;
  }
  
  .loading {
    flex: 1;
    @include flex-center;
    color: $gray-400;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    background: $white;
    border-bottom: 1px solid $gray-100;
    flex-shrink: 0;
    
    @include mobile {
      padding: 12px 16px;
      gap: 12px;
    }
    
    .back-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: $gray-50;
      border-radius: $radius-full;
      cursor: pointer;
      color: $gray-600;
      @include flex-center;
      transition: all $transition-fast;
      flex-shrink: 0;
      
      @include mobile {
        width: 32px;
        height: 32px;
      }
      
      &:hover {
        background: $gray-100;
        color: $gray-800;
      }
    }
    
    .chat-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      
      @include mobile {
        gap: 8px;
      }
      
      .avatar-wrapper {
        position: relative;
        flex-shrink: 0;
        
        img {
          width: 44px;
          height: 44px;
          border-radius: $radius-full;
          object-fit: cover;
          
          @include mobile {
            width: 40px;
            height: 40px;
          }
        }
        
        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: $success-color;
          border: 2px solid $white;
          border-radius: 50%;
          
          @include mobile {
            width: 8px;
            height: 8px;
          }
        }
      }
      
      .info {
        flex: 1;
        min-width: 0;
        
        h3 {
          font-size: $font-size-base;
          font-weight: 600;
          color: $gray-800;
          margin-bottom: 2px;
          @include text-ellipsis;
          
          @include mobile {
            font-size: $font-size-sm;
          }
        }
        
        .status {
          font-size: $font-size-xs;
          color: $gray-500;
          @include text-ellipsis;
          
          &.typing {
            color: $primary-color;
            font-weight: 500;
            animation: typingPulse 1.5s ease-in-out infinite;
          }
        }
      }
    }
    
    .chat-actions {
      display: flex;
      gap: 8px;
      
      .action-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        border-radius: $radius-full;
        cursor: pointer;
        color: $gray-500;
        @include flex-center;
        transition: all $transition-fast;
        
        &:hover {
          background: $gray-100;
          color: $primary-color;
        }
      }
    }
  }
  
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    background: $bg-chat;
    
    @include mobile {
      padding: 16px;
      padding-bottom: 20px;
    }
    
    .empty-messages {
      @include flex-center;
      height: 100%;
      color: $gray-400;
      font-size: $font-size-sm;
    }
    
    .message-item {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      
      @include mobile {
        gap: 8px;
        margin-bottom: 16px;
      }
      
      &.message-sending {
        opacity: 0.6;
      }
      
      &.message-failed {
        .message-bubble {
          border: 1px solid $error-color;
        }
      }
      
      &.message-self {
        flex-direction: row-reverse;
        
        .message-content {
          align-items: flex-end;
          
          .message-bubble {
            background: $bubble-self;
            color: $white;
          }
        }
      }
      
      .message-avatar {
        flex-shrink: 0;
        
        img {
          width: 40px;
          height: 40px;
          border-radius: $radius-full;
          object-fit: cover;
          
          @include mobile {
            width: 36px;
            height: 36px;
          }
        }
      }
      
      .message-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 60%;
        
        @include mobile {
          max-width: 75%;
        }
        
        .message-bubble {
          padding: 12px 16px;
          background: $bubble-other;
          border-radius: $radius-lg;
          font-size: $font-size-sm;
          color: $gray-800;
          word-wrap: break-word;
          box-shadow: $shadow-sm;
          position: relative;
          
          @include mobile {
            padding: 10px 14px;
            font-size: 14px;
          }
          
          .sending-indicator {
            display: block;
            font-size: $font-size-xs;
            color: $gray-400;
            margin-top: 4px;
          }
          
          .failed-indicator {
            display: block;
            font-size: $font-size-xs;
            color: $error-color;
            margin-top: 4px;
            cursor: pointer;
            text-decoration: underline;
            
            &:hover {
              color: darken($error-color, 10%);
            }
          }
        }
        
        .message-time {
          font-size: $font-size-xs;
          color: $gray-400;
          padding: 0 4px;
        }
      }
    }
  }
  
  .input-area {
    background: $white;
    border-top: 1px solid $gray-100;
    padding: 16px 24px;
    flex-shrink: 0;
    
    @include mobile {
      padding: 12px 16px;
    }
    
    .input-box {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      
      @include mobile {
        gap: 8px;
      }
      
      textarea {
        flex: 1;
        min-height: 80px;
        max-height: 200px;
        padding: 12px 16px;
        border: 1px solid $gray-200;
        border-radius: $radius-md;
        font-size: $font-size-sm;
        color: $gray-800;
        resize: vertical;
        outline: none;
        font-family: $font-family;
        overflow-y: hidden;
        
        @include mobile {
          min-height: 60px;
          max-height: 150px;
          padding: 10px 12px;
          font-size: 14px;
        }
        
        &:focus {
          border-color: $primary-color;
        }
        
        &::placeholder {
          color: $gray-400;
        }
      }
      
      .send-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: $primary-gradient;
        border-radius: $radius-full;
        cursor: pointer;
        color: $white;
        @include flex-center;
        transition: all $transition-fast;
        flex-shrink: 0;
        
        @include mobile {
          width: 36px;
          height: 36px;
        }
        
        &:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: $shadow-float;
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
  
  .empty-chat {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    color: $gray-400;
    
    p {
      font-size: $font-size-base;
      margin-bottom: 20px;
    }
    
    .btn-primary {
      padding: 12px 24px;
      background: $primary-gradient;
      color: $white;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      font-weight: 500;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-float;
      }
    }
  }
}
</style>
