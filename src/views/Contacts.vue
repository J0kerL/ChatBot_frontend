<template>
  <div class="contacts-page">
    <!-- 侧边导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="user-avatar" @click="goToProfile">
          <img :src="userStore.user.avatar || defaultAvatar" :alt="userStore.user.nickname" />
          <span class="status-indicator" :class="userStore.user.status"></span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/chat" class="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">消息</span>
        </router-link>
        
        <router-link to="/contacts" class="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
          </svg>
          <span class="nav-label">联系人</span>
        </router-link>
      </nav>
    </aside>

    <!-- 联系人列表 -->
    <section class="contact-list" :class="{ 'hide-mobile': showMobileDetail }">
      <div class="list-header">
        <h2>联系人</h2>
        <div class="header-actions">
          <button class="action-btn" title="添加好友">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM6 10V7H4V10H1V12H4V15H6V12H9V10H6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14Z" fill="currentColor"/>
            </svg>
          </button>
          <button class="action-btn" title="创建群聊">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
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
          placeholder="搜索联系人"
          @input="handleSearch"
        />
      </div>

      <div class="online-count">
        <span class="dot online"></span>
        <span>{{ contactStore.onlineCount }} 人在线</span>
      </div>
      
      <div class="contacts custom-scrollbar">
        <div 
          v-for="group in contactStore.groupedContacts" 
          :key="group.letter"
          class="contact-group"
        >
          <div class="group-letter">{{ group.letter }}</div>
          <ContactItem 
            v-for="contact in group.contacts"
            :key="contact.id"
            :contact="contact"
            @click="handleContactClick(contact)"
          />
        </div>
        
        <div v-if="contactStore.groupedContacts.length === 0" class="empty-list">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z" fill="currentColor"/>
          </svg>
          <p>暂无联系人</p>
        </div>
      </div>
    </section>

    <!-- 联系人详情 -->
    <main class="contact-detail" :class="{ 'show-mobile': showMobileDetail }">
      <template v-if="selectedContact">
        <!-- 移动端返回按钮 -->
        <button class="mobile-back-btn" @click="goBackToList">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          <span>返回</span>
        </button>
        <div class="detail-card glass">
          <div class="profile-header">
            <div class="avatar-large">
              <img :src="selectedContact.avatar" :alt="selectedContact.nickname" />
              <span class="status-badge" :class="selectedContact.status">
                {{ statusText[selectedContact.status] }}
              </span>
            </div>
            <h2>{{ selectedContact.nickname }}</h2>
            <p class="username">@{{ selectedContact.username }}</p>
            <p class="signature">{{ selectedContact.signature || '这个人很懒，什么都没写~' }}</p>
          </div>
          
          <div class="profile-actions">
            <button class="action-btn primary" @click="startChat(selectedContact)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
              </svg>
              <span>发消息</span>
            </button>
            <button class="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
              </svg>
              <span>语音通话</span>
            </button>
            <button class="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
              </svg>
              <span>视频通话</span>
            </button>
          </div>
          
          <div class="profile-info">
            <div class="info-item">
              <span class="label">邮箱</span>
              <span class="value">{{ selectedContact.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机</span>
              <span class="value">{{ selectedContact.phone }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <div v-else class="empty-detail">
        <div class="empty-illustration">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z" fill="url(#contactGradient)"/>
            <defs>
              <linearGradient id="contactGradient" x1="5" y1="5" x2="19" y2="11">
                <stop stop-color="#667eea" stop-opacity="0.3"/>
                <stop offset="1" stop-color="#764ba2" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3>选择一个联系人查看详情</h3>
        <p>从左侧列表中选择一个联系人</p>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/chat" class="mobile-nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
        </svg>
        <span>消息</span>
      </router-link>
      <router-link to="/contacts" class="mobile-nav-item active">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContactStore } from '@/stores/contact'
import ContactItem from '@/components/ContactItem.vue'

const router = useRouter()
const userStore = useUserStore()
const contactStore = useContactStore()

const searchKeyword = ref('')
const selectedContact = ref(null)
const showMobileDetail = ref(false)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const statusText = {
  online: '在线',
  offline: '离线',
  busy: '忙碌',
  away: '离开'
}

onMounted(() => {
  userStore.loadUser()
  contactStore.loadContacts()
})

const handleSearch = () => {
  contactStore.setSearchKeyword(searchKeyword.value)
}

const handleContactClick = (contact) => {
  selectedContact.value = contact
  contactStore.selectContact(contact)
  // 移动端显示详情页
  showMobileDetail.value = true
}

const goBackToList = () => {
  showMobileDetail.value = false
}

const startChat = (contact) => {
  // 跳转到聊天页面
  router.push('/chat')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.contacts-page {
  display: flex;
  height: 100vh;
  background: $bg-primary;
  overflow: hidden;
  
  @include mobile {
    flex-direction: column;
  }
}

// 侧边导航栏（复用chat页面样式）
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
  }
}

// 联系人列表
.contact-list {
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
    
    &.hide-mobile {
      display: none;
    }
  }
  
  .list-header {
    @include flex-between;
    padding: 20px;
    
    h2 {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $gray-800;
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
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
    margin: 0 20px 12px;
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

  .online-count {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    margin-bottom: 12px;
    font-size: $font-size-xs;
    color: $gray-500;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &.online {
        background: $success-color;
      }
    }
  }
  
  .contacts {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px;
    
    .contact-group {
      margin-bottom: 16px;
      
      .group-letter {
        padding: 8px 12px;
        font-size: $font-size-xs;
        font-weight: 600;
        color: $gray-400;
        text-transform: uppercase;
      }
    }
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

// 联系人详情
.contact-detail {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: $bg-chat;
  position: relative;
  
  @include mobile {
    display: none;
    flex-direction: column;
    padding: 20px;
    padding-top: 60px;
    padding-bottom: 80px;
    
    &.show-mobile {
      display: flex;
    }
  }
  
  .mobile-back-btn {
    display: none;
    position: absolute;
    top: 16px;
    left: 16px;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    font-size: $font-size-sm;
    color: $primary-color;
    background: $white;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    box-shadow: $shadow-sm;
    z-index: 10;
    
    @include mobile {
      display: flex;
    }
    
    &:hover {
      background: $gray-50;
    }
  }
  
  .detail-card {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    border-radius: $radius-xl;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    text-align: center;
    
    .profile-header {
      margin-bottom: 32px;
      
      .avatar-large {
        position: relative;
        display: inline-block;
        margin-bottom: 20px;
        
        img {
          width: 100px;
          height: 100px;
          border-radius: $radius-full;
          object-fit: cover;
          border: 4px solid $white;
          box-shadow: $shadow-lg;
        }
        
        .status-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          color: $white;
          border-radius: $radius-full;
          
          &.online { background: $success-color; }
          &.offline { background: $gray-400; }
          &.busy { background: $error-color; }
          &.away { background: $warning-color; }
        }
      }
      
      h2 {
        font-size: $font-size-2xl;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 4px;
      }
      
      .username {
        font-size: $font-size-sm;
        color: $gray-500;
        margin-bottom: 12px;
      }
      
      .signature {
        font-size: $font-size-sm;
        color: $gray-600;
        line-height: 1.6;
      }
    }
    
    .profile-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      
      .action-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-600;
        background: $gray-50;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        transition: all $transition-fast;
        
        &:hover {
          background: $gray-100;
          color: $primary-color;
        }
        
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
    
    .profile-info {
      .info-item {
        @include flex-between;
        padding: 16px 0;
        border-bottom: 1px solid $gray-100;
        
        &:last-child {
          border-bottom: none;
        }
        
        .label {
          font-size: $font-size-sm;
          color: $gray-500;
        }
        
        .value {
          font-size: $font-size-sm;
          color: $gray-800;
        }
      }
    }
  }
  
  .empty-detail {
    text-align: center;
    color: $gray-400;
    
    .empty-illustration {
      margin-bottom: 24px;
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
