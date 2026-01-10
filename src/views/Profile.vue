<template>
  <div class="profile-page">
    <!-- 顶部导航 -->
    <header class="page-header glass">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
        </svg>
      </button>
      <h1>个人资料</h1>
      <button class="edit-btn" @click="isEditing = !isEditing">
        {{ isEditing ? '取消' : '编辑' }}
      </button>
    </header>

    <main class="page-content custom-scrollbar">
      <!-- 头像区域 -->
      <section class="avatar-section">
        <div class="avatar-container">
          <img :src="userStore.user.avatar || defaultAvatar" :alt="userStore.user.username" />
          <button v-if="isEditing" class="change-avatar-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 4V1H5V4H8V6H5V9H3V6H0V4H3ZM6 10V7H9V4H16L17.83 6H21C22.1 6 23 6.9 23 8V20C23 21.1 22.1 22 21 22H5C3.9 22 3 21.1 3 20V10H6ZM13 19C15.76 19 18 16.76 18 14C18 11.24 15.76 9 13 9C10.24 9 8 11.24 8 14C8 16.76 10.24 19 13 19ZM9.8 14C9.8 15.77 11.23 17.2 13 17.2C14.77 17.2 16.2 15.77 16.2 14C16.2 12.23 14.77 10.8 13 10.8C11.23 10.8 9.8 12.23 9.8 14Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- 信息展示 -->
      <section class="info-section">
        <div class="info-card glass">
          <div class="info-item">
            <label>用户名</label>
            <span class="value">{{ userStore.user.username }}</span>
          </div>
          
          <div class="info-item">
            <label>邮箱</label>
            <input 
              v-if="isEditing" 
              v-model="form.email" 
              type="email"
              class="input"
              placeholder="请输入邮箱"
            />
            <span v-else class="value">{{ userStore.user.email || '未绑定' }}</span>
          </div>
        </div>

      <!-- 修改密码入口 -->
        <div class="info-card glass password-section">
          <button class="change-password-btn" @click="showPasswordModal = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
            </svg>
            <span>修改密码</span>
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <!-- 保存按钮 -->
        <button v-if="isEditing" class="save-btn" @click="saveProfile">
          保存修改
        </button>
      </section>

      <!-- 功能入口 -->
      <section class="menu-section">
        <!-- 退出登录 -->
        <button class="logout-btn" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
          </svg>
          退出登录
        </button>
      </section>
    </main>

    <!-- 修改密码弹窗 -->
    <Teleport to="body">
      <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
        <div class="password-modal glass">
          <div class="modal-header">
            <h3>修改密码</h3>
            <button class="close-btn" @click="closePasswordModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <form class="modal-content" @submit.prevent="handleChangePassword">
            <div class="form-item" :class="{ 'has-error': passwordErrors.oldPassword }">
              <label>当前密码</label>
              <input 
                v-model="passwordForm.oldPassword" 
                type="password" 
                placeholder="请输入当前密码"
                @blur="validatePasswordField('oldPassword')"
              />
              <span v-if="passwordErrors.oldPassword" class="error-msg">{{ passwordErrors.oldPassword }}</span>
            </div>
            <div class="form-item" :class="{ 'has-error': passwordErrors.newPassword }">
              <label>新密码</label>
              <input 
                v-model="passwordForm.newPassword" 
                type="password" 
                placeholder="请输入6-20位新密码"
                @blur="validatePasswordField('newPassword')"
              />
              <span v-if="passwordErrors.newPassword" class="error-msg">{{ passwordErrors.newPassword }}</span>
            </div>
            <div class="form-item" :class="{ 'has-error': passwordErrors.confirmPassword }">
              <label>确认新密码</label>
              <input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入新密码"
                @blur="validatePasswordField('confirmPassword')"
              />
              <span v-if="passwordErrors.confirmPassword" class="error-msg">{{ passwordErrors.confirmPassword }}</span>
            </div>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '确认修改' }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/chat" class="mobile-nav-item">
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
      <router-link to="/profile" class="mobile-nav-item active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
        </svg>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isEditing = ref(false)
const showPasswordModal = ref(false)
const isSubmitting = ref(false)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

const form = reactive({
  email: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  userStore.loadUser()
  // 初始化表单
  form.email = userStore.user.email
})

const goBack = () => {
  router.back()
}

const saveProfile = () => {
  userStore.setUser({
    ...userStore.user,
    email: form.email
  })
  isEditing.value = false
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  // 重置表单
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordErrors.oldPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
}

const validatePasswordField = (field) => {
  switch (field) {
    case 'oldPassword':
      if (!passwordForm.oldPassword) {
        passwordErrors.oldPassword = '请输入当前密码'
      } else {
        passwordErrors.oldPassword = ''
      }
      break
    case 'newPassword':
      if (!passwordForm.newPassword) {
        passwordErrors.newPassword = '请输入新密码'
      } else if (passwordForm.newPassword.length < 6 || passwordForm.newPassword.length > 20) {
        passwordErrors.newPassword = '密码长度为6-20个字符'
      } else if (passwordForm.newPassword === passwordForm.oldPassword) {
        passwordErrors.newPassword = '新密码不能与当前密码相同'
      } else {
        passwordErrors.newPassword = ''
      }
      break
    case 'confirmPassword':
      if (!passwordForm.confirmPassword) {
        passwordErrors.confirmPassword = '请确认新密码'
      } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
        passwordErrors.confirmPassword = '两次输入的密码不一致'
      } else {
        passwordErrors.confirmPassword = ''
      }
      break
  }
  return !passwordErrors[field]
}

const validatePasswordForm = () => {
  let isValid = true
  const fields = ['oldPassword', 'newPassword', 'confirmPassword']
  fields.forEach(field => {
    if (!validatePasswordField(field)) {
      isValid = false
    }
  })
  return isValid
}

const handleChangePassword = async () => {
  if (!validatePasswordForm()) return
  
  isSubmitting.value = true
  try {
    // 模拟接口调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('密码修改成功！')
    closePasswordModal()
  } catch (error) {
    alert('密码修改失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.profile-page {
  min-height: 100vh;
  background: $bg-primary;
  display: flex;
  flex-direction: column;
  
  @include mobile {
    padding-bottom: 70px;
  }
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
  
  .edit-btn {
    padding: 8px 16px;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $primary-color;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      opacity: 0.8;
    }
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

.avatar-section {
  text-align: center;
  margin-bottom: 24px;
  
  .avatar-container {
    position: relative;
    display: inline-block;
    
    img {
      width: 100px;
      height: 100px;
      border-radius: $radius-full;
      object-fit: cover;
      border: 4px solid $white;
      box-shadow: $shadow-lg;
    }
    
    .change-avatar-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 32px;
      height: 32px;
      background: $primary-gradient;
      border: 3px solid $white;
      border-radius: $radius-full;
      cursor: pointer;
      color: $white;
      @include flex-center;
      transition: all $transition-fast;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.info-section {
  margin-bottom: 24px;
  
  .info-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: $radius-lg;
    padding: 8px 0;
    margin-bottom: 20px;
    
    .info-item {
      display: flex;
      align-items: flex-start;
      padding: 16px 20px;
      border-bottom: 1px solid $gray-100;
      
      &:last-child {
        border-bottom: none;
      }
      
      label {
        width: 80px;
        font-size: $font-size-sm;
        color: $gray-500;
        flex-shrink: 0;
        padding-top: 8px;
      }
      
      .value {
        flex: 1;
        font-size: $font-size-sm;
        color: $gray-800;
        padding: 8px 0;
        
        &.readonly {
          color: $gray-500;
        }
        
        &.signature {
          line-height: 1.6;
        }
      }
      
      .input {
        flex: 1;
        padding: 8px 12px;
        font-size: $font-size-sm;
        color: $gray-800;
        background: $gray-50;
        border: 2px solid transparent;
        border-radius: $radius-sm;
        transition: all $transition-fast;
        
        &::placeholder {
          color: $gray-400;
        }
        
        &:focus {
          outline: none;
          background: $white;
          border-color: $primary-color;
        }
        
        &.textarea {
          resize: none;
          line-height: 1.6;
        }
      }
    }
  }
  
  .save-btn {
    width: 100%;
    padding: 14px;
    font-size: $font-size-base;
    font-weight: 600;
    color: $white;
    background: $primary-gradient;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-float;
    }
  }
}

.menu-section {
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
    
    &:hover {
      background: rgba($error-color, 0.15);
    }
  }
}

// 修改密码入口
.password-section {
  padding: 0 !important;
  overflow: hidden;
  
  .change-password-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    font-size: $font-size-sm;
    color: $gray-700;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      background: $gray-50;
    }
    
    span {
      flex: 1;
      text-align: left;
    }
    
    .arrow-icon {
      color: $gray-400;
    }
  }
}

// 修改密码弹窗
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.password-modal {
  width: 100%;
  max-width: 400px;
  background: $white;
  border-radius: $radius-xl;
  overflow: hidden;
  animation: modalSlideUp 0.3s ease;
  
  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid $gray-100;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $gray-800;
    }
    
    .close-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: $radius-full;
      cursor: pointer;
      color: $gray-500;
      @include flex-center;
      transition: all $transition-fast;
      
      &:hover {
        background: $gray-100;
        color: $gray-700;
      }
    }
  }
  
  .modal-content {
    padding: 20px;
    
    .form-item {
      margin-bottom: 20px;
      
      &:last-of-type {
        margin-bottom: 24px;
      }
      
      label {
        display: block;
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-700;
        margin-bottom: 8px;
      }
      
      input {
        width: 100%;
        padding: 12px 16px;
        font-size: $font-size-sm;
        color: $gray-800;
        background: $gray-50;
        border: 2px solid transparent;
        border-radius: $radius-md;
        transition: all $transition-fast;
        
        &::placeholder {
          color: $gray-400;
        }
        
        &:focus {
          outline: none;
          background: $white;
          border-color: $primary-color;
        }
      }
      
      &.has-error {
        input {
          border-color: $error-color;
          background: rgba($error-color, 0.05);
        }
      }
      
      .error-msg {
        display: block;
        font-size: 12px;
        color: $error-color;
        margin-top: 6px;
      }
    }
    
    .submit-btn {
      width: 100%;
      padding: 14px;
      font-size: $font-size-base;
      font-weight: 600;
      color: $white;
      background: $primary-gradient;
      border: none;
      border-radius: $radius-md;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: $shadow-float;
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
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
