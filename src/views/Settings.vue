<template>
  <div class="settings-page">
    <!-- 顶部导航 -->
    <header class="page-header glass">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
        </svg>
      </button>
      <h1>设置</h1>
      <div style="width: 40px;"></div>
    </header>

    <main class="page-content custom-scrollbar">
      <!-- 账号与安全 -->
      <section class="settings-section">
        <h3 class="section-title">账号与安全</h3>
        <div class="settings-card glass">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">修改密码</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">手机号绑定</span>
              <span class="setting-value">{{ userStore.user.phone || '未绑定' }}</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">邮箱绑定</span>
              <span class="setting-value">{{ userStore.user.email || '未绑定' }}</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 消息通知 -->
      <section class="settings-section">
        <h3 class="section-title">消息通知</h3>
        <div class="settings-card glass">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">新消息通知</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.notification" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">消息声音</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.sound" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">消息振动</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.vibration" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">消息预览</span>
              <span class="setting-desc">在通知中显示消息内容</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="settings.preview" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- 隐私设置 -->
      <section class="settings-section">
        <h3 class="section-title">隐私设置</h3>
        <div class="settings-card glass">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">添加我的方式</span>
              <span class="setting-value">手机号、用户名</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">黑名单</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 通用设置 -->
      <section class="settings-section">
        <h3 class="section-title">通用</h3>
        <div class="settings-card glass">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">主题模式</span>
              <span class="setting-value">跟随系统</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">字体大小</span>
              <span class="setting-value">标准</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">语言</span>
              <span class="setting-value">简体中文</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">清除缓存</span>
              <span class="setting-value">12.5 MB</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 关于 -->
      <section class="settings-section">
        <h3 class="section-title">关于</h3>
        <div class="settings-card glass">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">版本更新</span>
              <span class="setting-value">v1.0.0</span>
            </div>
            <span class="badge new">NEW</span>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">用户协议</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">隐私政策</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">意见反馈</span>
            </div>
            <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
        </svg>
        退出登录
      </button>
    </main>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const settings = reactive({
  notification: true,
  sound: true,
  vibration: true,
  preview: true
})

onMounted(() => {
  userStore.loadUser()
})

const goBack = () => {
  router.back()
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.settings-page {
  min-height: 100vh;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
}

.page-header {
  @include flex-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
  
  .back-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    border-radius: $radius-full;
    cursor: pointer;
    color: $gray-600;
    @include flex-center;
    transition: all $transition-fast;
    
    &:hover {
      background: $gray-100;
      color: $primary-color;
    }
  }
  
  h1 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-800;
  }
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  @include mobile {
    padding: 16px;
  }
}

.settings-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $gray-500;
    margin-bottom: 12px;
    padding-left: 4px;
  }
  
  .settings-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: $radius-lg;
    overflow: hidden;
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      cursor: pointer;
      transition: all $transition-fast;
      border-bottom: 1px solid $gray-100;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background: rgba($gray-50, 0.5);
      }
      
      .setting-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .setting-label {
          font-size: $font-size-sm;
          color: $gray-800;
        }
        
        .setting-value {
          font-size: $font-size-xs;
          color: $gray-500;
        }
        
        .setting-desc {
          font-size: $font-size-xs;
          color: $gray-400;
        }
      }
      
      .arrow {
        color: $gray-400;
        flex-shrink: 0;
      }
      
      .badge {
        padding: 4px 8px;
        font-size: 10px;
        font-weight: 600;
        border-radius: $radius-sm;
        
        &.new {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: $white;
        }
      }
    }
  }
}

// 开关样式
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + .slider {
      background: $primary-gradient;
      
      &::before {
        transform: translateX(20px);
      }
    }
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: $gray-300;
    border-radius: $radius-full;
    transition: all $transition-fast;
    
    &::before {
      content: '';
      position: absolute;
      width: 22px;
      height: 22px;
      left: 3px;
      bottom: 3px;
      background: $white;
      border-radius: 50%;
      transition: all $transition-fast;
      box-shadow: $shadow-sm;
    }
  }
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $error-color;
  background: rgba($error-color, 0.1);
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  margin-top: 20px;
  
  &:hover {
    background: rgba($error-color, 0.15);
  }
}
</style>
