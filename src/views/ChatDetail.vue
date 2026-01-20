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
              <span class="status">{{ conversation.relationship || '在线' }}</span>
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
            :class="{ 'message-self': message.sender === 'self' }"
          >
            <div class="message-avatar">
              <img :src="message.sender === 'self' ? userStore.user.avatar : conversation.avatar" />
            </div>
            <div class="message-content">
              <div class="message-bubble">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-toolbar">
            <button class="toolbar-btn" title="表情">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
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

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/messages" class="mobile-nav-item active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
        </svg>
        <span>消息</span>
      </router-link>
      <router-link to="/contacts" class="mobile-nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
        </svg>
        <span>联系人</span>
      </router-link>
      <router-link to="/profile" class="mobile-nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()

const loading = ref(false)
const conversation = ref(null)
const messages = ref([])
const inputMessage = ref('')
const messagesContainer = ref(null)
const showMoreMenu = ref(false)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

onMounted(() => {
  userStore.loadUser()
  loadConversation()
})

const loadConversation = async () => {
  const conversationId = parseInt(route.params.id)
  if (!conversationId) {
    return
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
      messages.value = chatStore.currentMessages
    }
  } catch (error) {
    console.error('加载会话失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSend = () => {
  if (!inputMessage.value.trim()) return
  
  const message = chatStore.sendMessage(inputMessage.value.trim())
  messages.value = chatStore.currentMessages
  inputMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })
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

// 监听消息变化，自动滚动到底部
watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.chat-detail-page {
  display: flex;
  height: 100vh;
  background: $bg-primary;
  overflow: hidden;
  
  @include mobile {
    flex-direction: column;
    
    .mobile-nav {
      display: none !important;
    }
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
      
      .avatar-wrapper {
        position: relative;
        
        img {
          width: 44px;
          height: 44px;
          border-radius: $radius-full;
          object-fit: cover;
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
        }
      }
      
      .info {
        h3 {
          font-size: $font-size-base;
          font-weight: 600;
          color: $gray-800;
          margin-bottom: 2px;
        }
        
        .status {
          font-size: $font-size-xs;
          color: $gray-500;
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
        }
      }
      
      .message-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 60%;
        
        .message-bubble {
          padding: 12px 16px;
          background: $bubble-other;
          border-radius: $radius-lg;
          font-size: $font-size-sm;
          color: $gray-800;
          word-wrap: break-word;
          box-shadow: $shadow-sm;
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
    
    .input-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      
      .toolbar-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: $radius-md;
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
    
    .input-box {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      
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

// 移动端底部导航
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: $white;
  border-top: 1px solid $gray-100;
  display: none;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 100;
  
  @include mobile {
    display: flex;
  }
  
  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: $gray-500;
    text-decoration: none;
    padding: 8px 16px;
    transition: all $transition-fast;
    
    &.active {
      color: $primary-color;
    }
    
    span {
      font-size: 11px;
    }
  }
}
</style>
