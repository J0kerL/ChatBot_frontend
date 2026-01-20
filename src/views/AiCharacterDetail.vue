<template>
  <div class="ai-detail-page">
    <div class="detail-container">
      <!-- 头部 -->
      <div class="detail-header">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          <span>返回</span>
        </button>
        <div class="header-actions">
          <button class="btn-edit" @click="goToEdit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
            </svg>
            编辑
          </button>
          <button class="btn-delete" @click="handleDelete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
            </svg>
            删除
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 详情内容 -->
      <div v-else-if="aiCharacter" class="detail-content">
        <!-- 顶部卡片 -->
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="aiCharacter.avatar || defaultAvatar" :alt="aiCharacter.name" />
          </div>
          <h1 class="profile-name">{{ aiCharacter.name }}</h1>
          <p class="profile-relationship" v-if="aiCharacter.relationship">
            {{ aiCharacter.relationship }}
          </p>
          <div class="profile-meta" v-if="aiCharacter.age">
            <span class="meta-item age-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#10b981"/>
              </svg>
              {{ aiCharacter.age }} 岁
            </span>
          </div>
          <div class="profile-tags" v-if="aiCharacter.personalityTags && aiCharacter.personalityTags.length">
            <span v-for="tag in aiCharacter.personalityTags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <div class="profile-actions">
            <button class="btn-primary" @click="startChat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
              </svg>
              开始聊天
            </button>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="info-sections">
          <!-- 外貌描述 -->
          <div class="info-section" v-if="aiCharacter.appearance">
            <div class="section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
              </svg>
              <h2>外貌描述</h2>
            </div>
            <p class="section-content">{{ aiCharacter.appearance }}</p>
          </div>

          <!-- 背景故事 -->
          <div class="info-section" v-if="aiCharacter.background">
            <div class="section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor"/>
              </svg>
              <h2>背景故事</h2>
            </div>
            <p class="section-content">{{ aiCharacter.background }}</p>
          </div>

          <!-- 说话风格 -->
          <div class="info-section" v-if="aiCharacter.speakingStyle">
            <div class="section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM18 14H6V12H18V14ZM18 11H6V9H18V11ZM18 8H6V6H18V8Z" fill="currentColor"/>
              </svg>
              <h2>说话风格</h2>
            </div>
            <p class="section-content">{{ aiCharacter.speakingStyle }}</p>
          </div>

          <!-- 记忆设定 -->
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="error-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
        </svg>
        <p>加载失败</p>
        <button class="btn-retry" @click="loadData">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAiCharacterById, deleteAiCharacter } from '@/api/aiCharacter'
import { showDeleteConfirm, showAlert } from '@/utils/dialog'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const aiCharacter = ref(null)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

onMounted(() => {
  loadData()
})

const loadData = async () => {
  const id = route.params.id
  if (!id) {
    await showAlert('缺少参数', { confirmType: 'warning' })
    goBack()
    return
  }
  
  try {
    loading.value = true
    aiCharacter.value = await getAiCharacterById(id)
  } catch (error) {
    console.error('加载失败:', error)
    await showAlert('加载失败: ' + error.message, { confirmType: 'danger' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/contacts')
}

const goToEdit = () => {
  router.push(`/ai/edit/${aiCharacter.value.id}`)
}

const handleDelete = async () => {
  const confirmed = await showDeleteConfirm(`确定要删除 "${aiCharacter.value.name}" 吗？`)
  if (!confirmed) return
  
  try {
    await deleteAiCharacter(aiCharacter.value.id)
    await showAlert('删除成功', { confirmType: 'primary' })
    router.push('/contacts')
  } catch (error) {
    await showAlert('删除失败: ' + error.message, { confirmType: 'danger' })
  }
}

const startChat = () => {
  // TODO: 跳转到聊天页面
  router.push('/chat')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.ai-detail-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 20px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.detail-header {
  @include flex-between;
  margin-bottom: 24px;
  
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: $white;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $gray-700;
    cursor: pointer;
    box-shadow: $shadow-sm;
    transition: all $transition-fast;
    
    &:hover {
      background: $gray-50;
    }
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
    
    button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      font-weight: 500;
      cursor: pointer;
      transition: all $transition-fast;
    }
    
    .btn-edit {
      background: rgba(16, 185, 129, 0.1);
      color: $primary-color;
      
      &:hover {
        background: $primary-color;
        color: $white;
      }
    }
    
    .btn-delete {
      background: rgba(239, 68, 68, 0.1);
      color: $error-color;
      
      &:hover {
        background: $error-color;
        color: $white;
      }
    }
  }
}

.loading {
  @include flex-center;
  flex-direction: column;
  padding: 80px 20px;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid $gray-200;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }
  
  p {
    color: $gray-500;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  background: $white;
  border-radius: $radius-xl;
  padding: 40px;
  text-align: center;
  box-shadow: $shadow-md;
  
  .profile-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: $radius-full;
      object-fit: cover;
      border: 4px solid $white;
      box-shadow: $shadow-lg;
    }
  }
  
  .profile-name {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $gray-800;
    margin-bottom: 8px;
  }
  
  .profile-relationship {
    font-size: $font-size-base;
    color: $gray-600;
    margin-bottom: 16px;
  }
  
  .profile-meta {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: $font-size-sm;
      color: $gray-600;
      
      svg {
        opacity: 0.5;
      }
    }
  }
  
  .profile-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
    
    .tag {
      display: inline-block;
      padding: 6px 14px;
      font-size: $font-size-sm;
      color: $primary-color;
      background: rgba(16, 185, 129, 0.1);
      border-radius: $radius-full;
    }
  }
  
  .profile-actions {
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: $primary-gradient;
      color: $white;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-base;
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

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  background: $white;
  border-radius: $radius-lg;
  padding: 24px;
  box-shadow: $shadow-sm;
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    
    svg {
      color: $primary-color;
      flex-shrink: 0;
    }
    
    h2 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-800;
    }
  }
  
  .section-content {
    font-size: $font-size-base;
    color: $gray-600;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

.error-state {
  @include flex-center;
  flex-direction: column;
  padding: 80px 20px;
  color: $gray-400;
  
  svg {
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  p {
    font-size: $font-size-base;
    margin-bottom: 20px;
  }
  
  .btn-retry {
    padding: 10px 24px;
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
</style>
