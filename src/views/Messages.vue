<template>
  <div class="messages-page">
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

    <!-- 会话列表 -->
    <section class="conversation-list">
      <div class="list-header">
        <h2>消息</h2>
        <div class="header-actions">
          <button class="action-btn primary" @click="showCreateDialog = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
            </svg>
            <span>新建会话</span>
          </button>
        </div>
      </div>
      
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索会话"
          @input="handleSearch"
        />
      </div>
      
      <div class="conversation-list-content custom-scrollbar">
        <div v-if="chatStore.loading" class="loading">加载中...</div>
        
        <div v-else-if="chatStore.filteredConversations.length > 0" class="conversations">
          <div 
            v-for="conversation in chatStore.filteredConversations" 
            :key="conversation.id"
            class="conversation-wrapper"
          >
            <div 
              class="conversation-card"
              :class="{ pinned: conversation.isPinned }"
              :style="getSwipeStyle(conversation.id)"
              @click="goToChat(conversation)"
              @touchstart="handleTouchStart($event, conversation.id)"
              @touchmove="handleTouchMove($event, conversation.id)"
              @touchend="handleTouchEnd"
            >
              <div class="conversation-avatar">
                <img :src="conversation.avatar || defaultAvatar" :alt="conversation.name" />
                <span v-if="conversation.online" class="online-indicator"></span>
              </div>
              <div class="conversation-info">
                <div class="top-row">
                  <h3>{{ conversation.name }}</h3>
                  <span class="time">{{ formatTime(conversation.lastTime) }}</span>
                </div>
                <div class="bottom-row">
                  <p class="last-message">{{ conversation.lastMessage }}</p>
                  <span v-if="conversation.unreadCount > 0" class="unread-badge">
                    {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
                  </span>
                </div>
              </div>
              <div class="conversation-actions desktop-actions">
                <button 
                  class="btn-pin" 
                  @click.stop="handlePin(conversation)" 
                  :title="conversation.isPinned ? '取消置顶' : '置顶'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 9V4H17C17.55 4 18 3.55 18 3C18 2.45 17.55 2 17 2H7C6.45 2 6 2.45 6 3C6 3.55 6.45 4 7 4H8V9C8 10.66 6.66 12 5 12V14H10.97V21L11.97 22L12.97 21V14H19V12C17.34 12 16 10.66 16 9Z" :fill="conversation.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
                <button class="btn-delete" @click.stop="handleDelete(conversation)" title="删除">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="swipe-actions">
              <button class="swipe-btn btn-pin" @click.stop="handlePin(conversation)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 9V4H17C17.55 4 18 3.55 18 3C18 2.45 17.55 2 17 2H7C6.45 2 6 2.45 6 3C6 3.55 6.45 4 7 4H8V9C8 10.66 6.66 12 5 12V14H10.97V21L11.97 22L12.97 21V14H19V12C17.34 12 16 10.66 16 9Z" :fill="conversation.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              <button class="swipe-btn btn-delete" @click.stop="handleDelete(conversation)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-list">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <p>暂无会话</p>
          <button class="btn-primary" @click="showCreateDialog = true">创建第一个会话</button>
        </div>
      </div>
    </section>

    <!-- 创建会话对话框 -->
    <div v-if="showCreateDialog" class="dialog-overlay" @click="showCreateDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>选择联系人</h3>
          <button class="close-btn" @click="showCreateDialog = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
            </svg>
            <input 
              v-model="contactSearchKeyword" 
              type="text" 
              placeholder="搜索联系人"
            />
          </div>
          <div v-if="loadingContacts" class="loading">加载中...</div>
          <div v-else-if="filteredContacts.length > 0" class="contact-list custom-scrollbar">
            <div 
              v-for="contact in filteredContacts" 
              :key="contact.id"
              class="contact-item"
              @click="handleCreateConversation(contact.id)"
            >
              <img :src="contact.avatar || defaultAvatar" :alt="contact.name" />
              <div class="contact-info">
                <h4>{{ contact.name }}</h4>
                <p>{{ contact.relationship }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-contacts">
            <p>暂无联系人</p>
            <button class="btn-link" @click="goToContacts">去添加联系人</button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { getAiCharacterPage } from '@/api/aiCharacter'
import { showDeleteConfirm, showAlert } from '@/utils/dialog'

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()

const searchKeyword = ref('')
const showCreateDialog = ref(false)
const contactSearchKeyword = ref('')
const contacts = ref([])
const loadingContacts = ref(false)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

// 滑动相关状态
const touchStartX = ref(0)
const touchCurrentX = ref(0)
const swipingConversationId = ref(null)
const swipeOffset = ref(0)

const filteredContacts = computed(() => {
  if (!contactSearchKeyword.value) return contacts.value
  const keyword = contactSearchKeyword.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(keyword) ||
    contact.relationship?.toLowerCase().includes(keyword)
  )
})

onMounted(() => {
  userStore.loadUser()
  loadConversations()
})

const loadConversations = async () => {
  try {
    await chatStore.loadConversations()
  } catch (error) {
    await showAlert('加载会话列表失败: ' + error.message, { confirmType: 'danger' })
  }
}

const loadContacts = async () => {
  try {
    loadingContacts.value = true
    const result = await getAiCharacterPage({ pageNum: 1, pageSize: 100 })
    contacts.value = result.records || []
  } catch (error) {
    console.error('加载联系人失败:', error)
  } finally {
    loadingContacts.value = false
  }
}

const handleSearch = () => {
  chatStore.setSearchKeyword(searchKeyword.value)
}

const handlePin = async (conversation) => {
  // 立即重置滑动状态
  resetSwipe()
  
  try {
    await chatStore.togglePin(conversation.id, !conversation.isPinned)
    // 使用 setTimeout 确保在 Vue 重新渲染后重置
    setTimeout(() => {
      resetSwipe()
    }, 50)
  } catch (error) {
    await showAlert('操作失败: ' + error.message, { confirmType: 'danger' })
  }
}

const handleDelete = async (conversation) => {
  // 立即重置滑动状态
  resetSwipe()
  
  const confirmed = await showDeleteConfirm(`确定要删除与 "${conversation.name}" 的会话吗？`)
  if (!confirmed) {
    return
  }
  
  try {
    await chatStore.deleteConversation(conversation.id)
    await showAlert('删除成功', { confirmType: 'primary' })
  } catch (error) {
    await showAlert('删除失败: ' + error.message, { confirmType: 'danger' })
  }
}

const handleCreateConversation = async (characterId) => {
  try {
    const conversation = await chatStore.createNewConversation(characterId)
    showCreateDialog.value = false
    // 跳转到聊天页面
    router.push(`/messages/${conversation.id}`)
  } catch (error) {
    await showAlert('创建会话失败: ' + error.message, { confirmType: 'danger' })
  }
}

const goToChat = (conversation) => {
  // 如果正在滑动，先重置
  if (swipingConversationId.value) {
    resetSwipe()
    return
  }
  chatStore.selectConversation(conversation)
  router.push(`/messages/${conversation.id}`)
}

const goToProfile = () => {
  router.push('/profile')
}

const goToContacts = () => {
  showCreateDialog.value = false
  router.push('/contacts')
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 滑动相关方法
const handleTouchStart = (e, conversationId) => {
  touchStartX.value = e.touches[0].clientX
  touchCurrentX.value = e.touches[0].clientX
  swipingConversationId.value = conversationId
}

const handleTouchMove = (e, conversationId) => {
  if (swipingConversationId.value !== conversationId) return
  
  touchCurrentX.value = e.touches[0].clientX
  const diff = touchStartX.value - touchCurrentX.value
  
  // 只允许向左滑动，最大滑动距离为140px
  if (diff > 0 && diff <= 140) {
    swipeOffset.value = diff
  } else if (diff > 140) {
    swipeOffset.value = 140
  } else {
    swipeOffset.value = 0
  }
}

const handleTouchEnd = () => {
  // 如果滑动距离超过70px，则完全展开到140px，否则回弹
  if (swipeOffset.value > 70) {
    swipeOffset.value = 140
  } else {
    resetSwipe()
  }
}

const resetSwipe = () => {
  swipeOffset.value = 0
  swipingConversationId.value = null
}

const getSwipeStyle = (conversationId) => {
  if (swipingConversationId.value === conversationId) {
    return {
      transform: `translateX(-${swipeOffset.value}px)`,
      transition: swipeOffset.value === 0 || touchCurrentX.value === touchStartX.value ? 'transform 0.3s ease' : 'none'
    }
  }
  return {
    transform: 'translateX(0px)',
    transition: 'transform 0.3s ease'
  }
}

// 监听对话框打开，加载联系人
const watchDialog = () => {
  if (showCreateDialog.value) {
    loadContacts()
  }
}

// 使用watch监听showCreateDialog
watch(showCreateDialog, watchDialog)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.messages-page {
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

// 会话列表
.conversation-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: $white;
  overflow: hidden;
  
  @include mobile {
    padding-bottom: 70px;
  }
  
  .list-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 30px;
    border-bottom: 1px solid $gray-100;
    
    h2 {
      flex: 1;
      font-size: $font-size-xl;
      font-weight: 600;
      color: $gray-800;
    }
    
    .header-actions {
      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: $radius-md;
        font-size: $font-size-sm;
        font-weight: 500;
        cursor: pointer;
        transition: all $transition-fast;
        
        &.primary {
          background: $primary-gradient;
          color: $white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: $shadow-float;
          }
        }
      }
    }
  }
  
  .search-box {
    margin: 20px 30px;
    padding: 12px 16px;
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
  
  .conversation-list-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 30px 24px;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: $gray-400;
  }
  
  .conversations {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  
  .conversation-wrapper {
    position: relative;
    margin-bottom: 12px;
    background: transparent;
  }
  
  .swipe-actions {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 140px;
    display: flex;
    align-items: center;
    gap: 0;
    
    @media (min-width: 769px) {
      display: none;
    }
    
    .swipe-btn {
      width: 70px;
      height: 100%;
      border: none;
      cursor: pointer;
      @include flex-center;
      flex-direction: column;
      gap: 4px;
      transition: all $transition-fast;
      border-radius: 0;
      
      svg {
        flex-shrink: 0;
      }
      
      &.btn-pin {
        background: $primary-color;
        color: $white;
        border-radius: $radius-lg 0 0 $radius-lg;
        
        &:active {
          background: $primary-dark;
        }
      }
      
      &.btn-delete {
        background: $error-color;
        color: $white;
        border-radius: 0 $radius-lg $radius-lg 0;
        
        &:active {
          background: #dc2626;
        }
      }
    }
  }
  
  .conversation-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: $white;
    border: 1px solid $gray-100;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: transform $transition-fast, box-shadow $transition-fast, border-color $transition-fast;
    z-index: 2;
    
    @include mobile {
      touch-action: pan-y;
      user-select: none;
    }
    
    &.pinned {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    &:hover {
      @media (min-width: 769px) {
        transform: translateY(-2px);
        box-shadow: $shadow-md;
        border-color: $primary-color;
        
        .desktop-actions {
          opacity: 1;
        }
      }
    }
    
    .conversation-avatar {
      position: relative;
      flex-shrink: 0;
      
      img {
        width: 56px;
        height: 56px;
        border-radius: $radius-full;
        object-fit: cover;
      }
      
      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: $success-color;
        border: 2px solid $white;
        border-radius: 50%;
      }
    }
    
    .conversation-info {
      flex: 1;
      min-width: 0;
      
      @media (min-width: 769px) {
        padding-right: 100px;
      }
      
      .top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 6px;
        gap: 12px;
        
        h3 {
          flex: 1;
          font-size: $font-size-base;
          font-weight: 600;
          color: $gray-800;
          @include text-ellipsis;
        }
        
        .time {
          font-size: $font-size-xs;
          color: $gray-400;
          flex-shrink: 0;
          white-space: nowrap;
          
          @media (min-width: 769px) {
            position: absolute;
            top: 16px;
            right: 16px;
          }
        }
      }
      
      .bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .last-message {
          flex: 1;
          font-size: $font-size-sm;
          color: $gray-500;
          @include text-ellipsis;
        }
        
        .unread-badge {
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          font-size: 11px;
          font-weight: 600;
          color: $white;
          background: $error-color;
          border-radius: $radius-full;
          @include flex-center;
          flex-shrink: 0;
          margin-left: 8px;
        }
      }
    }
    
    .conversation-actions {
      position: absolute;
      right: 12px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity $transition-fast;
      
      @media (min-width: 769px) {
        top: 16px;
        right: 80px;
      }
      
      @media (max-width: 768px) {
        top: 12px;
      }
      
      &.desktop-actions {
        @include mobile {
          display: none;
        }
      }
      
      button {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        @include flex-center;
        transition: all $transition-fast;
        
        &.btn-pin {
          background: rgba(16, 185, 129, 0.1);
          color: $primary-color;
          
          &:hover {
            background: $primary-color;
            color: $white;
          }
        }
        
        &.btn-delete {
          background: rgba(239, 68, 68, 0.1);
          color: $error-color;
          
          &:hover {
            background: $error-color;
            color: $white;
          }
        }
      }
    }
  }
  
  .empty-list {
    @include flex-center;
    flex-direction: column;
    padding: 60px 20px;
    color: $gray-400;
    
    svg {
      margin-bottom: 20px;
      opacity: 0.5;
    }
    
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

// 对话框
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  @include flex-center;
  z-index: $z-modal;
  
  .dialog-content {
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    background: $white;
    border-radius: $radius-lg;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .dialog-header {
      @include flex-between;
      padding: 20px 24px;
      border-bottom: 1px solid $gray-100;
      
      h3 {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $gray-800;
      }
      
      .close-btn {
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
          color: $gray-800;
        }
      }
    }
    
    .dialog-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 20px 24px;
      
      .search-box {
        margin-bottom: 16px;
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
      
      .contact-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: $radius-md;
          cursor: pointer;
          transition: all $transition-fast;
          
          &:hover {
            background: $gray-50;
          }
          
          img {
            width: 48px;
            height: 48px;
            border-radius: $radius-full;
            object-fit: cover;
          }
          
          .contact-info {
            flex: 1;
            min-width: 0;
            
            h4 {
              font-size: $font-size-sm;
              font-weight: 600;
              color: $gray-800;
              margin-bottom: 2px;
              @include text-ellipsis;
            }
            
            p {
              font-size: $font-size-xs;
              color: $gray-500;
              @include text-ellipsis;
            }
          }
        }
      }
      
      .empty-contacts {
        @include flex-center;
        flex-direction: column;
        padding: 40px 20px;
        color: $gray-400;
        
        p {
          font-size: $font-size-sm;
          margin-bottom: 16px;
        }
        
        .btn-link {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid $primary-color;
          border-radius: $radius-md;
          color: $primary-color;
          font-size: $font-size-sm;
          cursor: pointer;
          transition: all $transition-fast;
          
          &:hover {
            background: $primary-color;
            color: $white;
          }
        }
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
