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
        <router-link to="/messages" class="nav-item">
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
    <section class="contact-list">
      <div class="list-header">
        <h2>联系人</h2>
        <div class="header-actions">
          <button class="action-btn primary" @click="goToAdd">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
            </svg>
            <span>添加联系人</span>
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
      
      <div class="contact-list-content custom-scrollbar">
        <div v-if="loading" class="loading">加载中...</div>
        
        <div v-else-if="characters.length > 0" class="contact-grid">
          <div 
            v-for="character in characters" 
            :key="character.id"
            class="contact-card"
            @click="goToDetail(character.id)"
          >
            <div class="contact-avatar">
              <img :src="character.avatar || defaultAvatar" :alt="character.name" />
            </div>
            <div class="contact-info">
              <h3>{{ character.name }}</h3>
              <p class="relationship">{{ character.relationship }}</p>
              <div class="tags" v-if="character.personalityTags && character.personalityTags.length">
                <span v-for="tag in character.personalityTags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="contact-actions">
              <button class="btn-edit" @click.stop="goToEdit(character.id)" title="编辑">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                </svg>
              </button>
              <button class="btn-delete" @click.stop="handleDelete(character)" title="删除">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-list">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
          </svg>
          <p>暂无联系人</p>
          <button class="btn-primary" @click="goToAdd">创建第一个联系人</button>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <button 
          class="page-btn" 
          :disabled="pageNum === 1"
          @click="changePage(pageNum - 1)"
        >
          上一页
        </button>
        <span class="page-info">{{ pageNum }} / {{ totalPages }}</span>
        <button 
          class="page-btn"
          :disabled="pageNum >= totalPages"
          @click="changePage(pageNum + 1)"
        >
          下一页
        </button>
      </div>
    </section>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/messages" class="mobile-nav-item">
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAiCharacterPage, deleteAiCharacter } from '@/api/aiCharacter'
import { showDeleteConfirm, showAlert } from '@/utils/dialog'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const loading = ref(false)
const characters = ref([])
const pageNum = ref(1)
const pageSize = ref(12)
const total = ref(0)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

onMounted(() => {
  userStore.loadUser()
  loadCharacters()
})

const loadCharacters = async () => {
  try {
    loading.value = true
    const result = await getAiCharacterPage({
      name: searchKeyword.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    characters.value = result.records || []
    total.value = result.total || 0
  } catch (error) {
    console.error('加载联系人失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNum.value = 1
  loadCharacters()
}

const changePage = (page) => {
  pageNum.value = page
  loadCharacters()
}

const goToAdd = () => {
  router.push('/ai/add')
}

const goToDetail = (id) => {
  router.push(`/ai/detail/${id}`)
}

const goToEdit = (id) => {
  router.push(`/ai/edit/${id}`)
}

const handleDelete = async (character) => {
  const confirmed = await showDeleteConfirm(`确定要删除 "${character.name}" 吗？`)
  if (!confirmed) return
  
  try {
    await deleteAiCharacter(character.id)
    await showAlert('删除成功', { confirmType: 'primary' })
    loadCharacters()
  } catch (error) {
    await showAlert('删除失败: ' + error.message, { confirmType: 'danger' })
  }
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
  
  .contact-list-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 30px 24px;
    position: relative;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: $gray-400;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    @include mobile {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
  }
  
  .contact-card {
    position: relative;
    background: $white;
    border: 1px solid $gray-100;
    border-radius: $radius-lg;
    padding: 24px;
    cursor: pointer;
    transition: all $transition-fast;
    z-index: 0;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-float;
      border-color: $primary-color;
      z-index: 2;
      
      .contact-actions {
        opacity: 1;
      }
    }
    
    // 移动端点击时显示操作按钮
    @include mobile {
      &:active {
        transform: translateY(-2px);
        box-shadow: $shadow-float;
        border-color: $primary-color;
        
        .contact-actions {
          opacity: 1;
        }
      }
    }
    
    .contact-avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      
      img {
        width: 100%;
        height: 100%;
        border-radius: $radius-full;
        object-fit: cover;
      }
    }
    
    .contact-info {
      text-align: center;
      
      h3 {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 4px;
      }
      
      .relationship {
        font-size: $font-size-sm;
        color: $gray-500;
        margin-bottom: 12px;
      }
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        
        .tag {
          display: inline-block;
          padding: 4px 10px;
          font-size: $font-size-xs;
          color: $primary-color;
          background: rgba(16, 185, 129, 0.1);
          border-radius: $radius-full;
        }
      }
    }
    
    .contact-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity $transition-fast;
      
      // 移动端始终显示操作按钮
      @include mobile {
        opacity: 1;
      }
      
      button {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        @include flex-center;
        transition: all $transition-fast;
        
        &.btn-edit {
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
  
  .pagination {
    @include flex-center;
    gap: 16px;
    padding: 20px;
    border-top: 1px solid $gray-100;
    
    .page-btn {
      padding: 8px 16px;
      background: $white;
      border: 1px solid $gray-200;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      color: $gray-700;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover:not(:disabled) {
        background: $primary-color;
        color: $white;
        border-color: $primary-color;
      }
      
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
    
    .page-info {
      font-size: $font-size-sm;
      color: $gray-600;
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
