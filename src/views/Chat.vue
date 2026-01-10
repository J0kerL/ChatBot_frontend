<template>
  <div class="chat-page">
    <!-- 侧边导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="user-avatar" @click="goToProfile">
          <img :src="userStore.user.avatar || defaultAvatar" :alt="userStore.user.nickname" />
          <span class="status-indicator" :class="userStore.user.status"></span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/chat" class="nav-item" :class="{ active: currentRoute === 'Chat' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">消息</span>
          <span v-if="chatStore.totalUnread > 0" class="badge">{{ chatStore.totalUnread > 99 ? '99+' : chatStore.totalUnread }}</span>
        </router-link>
        
        <router-link to="/contacts" class="nav-item" :class="{ active: currentRoute === 'Contacts' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">联系人</span>
        </router-link>
      </nav>
    </aside>

    <!-- 会话列表 -->
    <section class="conversation-list">
      <div class="list-header">
        <h2>消息</h2>
        <button class="action-btn" title="发起聊天">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索"
          @input="handleSearch"
        />
      </div>
      
      <div class="conversations custom-scrollbar">
        <ConversationItem
          v-for="conversation in chatStore.filteredConversations"
          :key="conversation.id"
          :conversation="conversation"
          :active="chatStore.currentConversation?.id === conversation.id"
          @click="selectConversation(conversation)"
        />
        <div v-if="chatStore.filteredConversations.length === 0" class="empty-list">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <p>暂无会话</p>
        </div>
      </div>
    </section>

    <!-- 聊天区域 -->
    <main class="chat-area">
      <template v-if="chatStore.currentConversation">
        <!-- 聊天头部 -->
        <header class="chat-header glass">
          <div class="chat-info">
            <div class="avatar-wrapper">
              <img :src="chatStore.currentConversation.avatar" :alt="chatStore.currentConversation.name" />
              <span v-if="chatStore.currentConversation.online" class="online-dot"></span>
            </div>
            <div class="info">
              <h3>{{ chatStore.currentConversation.name }}</h3>
              <span class="status">
                {{ chatStore.currentConversation.type === 'group' 
                  ? `${chatStore.currentConversation.memberCount}位成员` 
                  : (chatStore.currentConversation.online ? '在线' : '离线') 
                }}
              </span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" title="语音通话">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="action-btn" title="视频通话">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="action-btn" title="更多">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- 消息列表 -->
        <div class="messages-container custom-scrollbar" ref="messagesContainer">
          <MessageItem
            v-for="message in chatStore.currentMessages"
            :key="message.id"
            :message="message"
          />
        </div>

        <!-- 输入区域 -->
        <MessageInput @send="handleSendMessage" />
      </template>

      <!-- 空状态 -->
      <div v-else class="empty-chat">
        <div class="empty-illustration">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="url(#emptyGradient)"/>
            <defs>
              <linearGradient id="emptyGradient" x1="2" y1="2" x2="22" y2="22">
                <stop stop-color="#667eea" stop-opacity="0.3"/>
                <stop offset="1" stop-color="#764ba2" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3>选择一个会话开始聊天</h3>
        <p>从左侧列表中选择一个会话，或者开始新的对话</p>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/chat" class="mobile-nav-item" :class="{ active: currentRoute === 'Chat' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
        </svg>
        <span>消息</span>
        <span v-if="chatStore.totalUnread > 0" class="badge">{{ chatStore.totalUnread > 99 ? '99+' : chatStore.totalUnread }}</span>
      </router-link>
      <router-link to="/contacts" class="mobile-nav-item" :class="{ active: currentRoute === 'Contacts' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
        </svg>
        <span>联系人</span>
      </router-link>
      <router-link to="/profile" class="mobile-nav-item" :class="{ active: currentRoute === 'Profile' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import ConversationItem from '@/components/ConversationItem.vue'
import MessageItem from '@/components/MessageItem.vue'
import MessageInput from '@/components/MessageInput.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()

const searchKeyword = ref('')
const messagesContainer = ref(null)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const currentRoute = computed(() => route.name)

onMounted(() => {
  userStore.loadUser()
  chatStore.loadConversations()
})

const handleSearch = () => {
  chatStore.setSearchKeyword(searchKeyword.value)
}

const selectConversation = (conversation) => {
  chatStore.selectConversation(conversation)
}

const handleSendMessage = (content) => {
  chatStore.sendMessage(content)
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const goToProfile = () => {
  router.push('/profile')
}

// 监听消息变化，自动滚动到底部
watch(
  () => chatStore.currentMessages.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  }
)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.chat-page {
  display: flex;
  height: 100vh;
  background: $bg-primary;
  overflow: hidden;
  
  @include mobile {
    flex-direction: column;
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
    background: none;
    border: none;
    
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
    
    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-size: 10px;
      background: $error-color;
      color: $white;
      border-radius: $radius-full;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// 会话列表
.conversation-list {
  width: 320px;
  background: $white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $gray-100;
  flex-shrink: 0;
  
  @include mobile {
    width: 100%;
    flex: 1;
    padding-bottom: 70px;
  }
  
  .list-header {
    @include flex-between;
    padding: 20px;
    
    h2 {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $gray-800;
    }
    
    .action-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: $gray-50;
      border-radius: $radius-full;
      cursor: pointer;
      color: $gray-600;
      @include flex-center;
      transition: all $transition-fast;
      
      &:hover {
        background: $primary-color;
        color: $white;
      }
    }
  }
  
  .search-box {
    margin: 0 20px 16px;
    padding: 10px 14px;
    background: $gray-50;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      color: $gray-400;
      flex-shrink: 0;
    }
    
    input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: $font-size-sm;
      color: $gray-800;
      outline: none;
      
      &::placeholder {
        color: $gray-400;
      }
    }
  }
  
  .conversations {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px;
  }
  
  .empty-list {
    @include flex-center;
    flex-direction: column;
    padding: 40px 20px;
    color: $gray-400;
    
    svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    p {
      font-size: $font-size-sm;
    }
  }
}

// 聊天区域
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: $bg-chat;
  min-width: 0;
  
  @include mobile {
    display: none;
    
    &.show {
      display: flex;
    }
  }
  
  .chat-header {
    @include flex-between;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
    
    .chat-info {
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
  }
  
  .empty-chat {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    color: $gray-400;
    
    .empty-illustration {
      margin-bottom: 24px;
      
      svg {
        opacity: 0.8;
      }
    }
    
    h3 {
      font-size: $font-size-lg;
      color: $gray-600;
      margin-bottom: 8px;
    }
    
    p {
      font-size: $font-size-sm;
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
    position: relative;
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
    
    span:last-of-type:not(.badge) {
      font-size: 11px;
    }
    
    .badge {
      position: absolute;
      top: 0;
      right: 8px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-size: 10px;
      background: $error-color;
      color: $white;
      border-radius: $radius-full;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
