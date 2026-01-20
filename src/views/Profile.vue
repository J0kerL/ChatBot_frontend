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
      <button class="logout-btn-header hide-mobile" @click="handleLogout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
        </svg>
        <span>退出登录</span>
      </button>
    </header>

    <main class="page-content custom-scrollbar">
      <!-- PC端左右布局容器 -->
      <div class="profile-container">
        <!-- 左侧：用户信息卡片 -->
        <div class="profile-left">
          <!-- 头像区域 -->
          <section class="avatar-section">
            <div class="avatar-container">
              <img :src="userStore.user.avatar || defaultAvatar" :alt="userStore.user.username" />
              <!-- 头像上传按钮（不需要编辑模式） -->
              <button class="change-avatar-btn" @click="triggerFileInput" :disabled="uploadingAvatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 4V1H5V4H8V6H5V9H3V6H0V4H3ZM6 10V7H9V4H16L17.83 6H21C22.1 6 23 6.9 23 8V20C23 21.1 22.1 22 21 22H5C3.9 22 3 21.1 3 20V10H6ZM13 19C15.76 19 18 16.76 18 14C18 11.24 15.76 9 13 9C10.24 9 8 11.24 8 14C8 16.76 10.24 19 13 19ZM9.8 14C9.8 15.77 11.23 17.2 13 17.2C14.77 17.2 16.2 15.77 16.2 14C16.2 12.23 14.77 10.8 13 10.8C11.23 10.8 9.8 12.23 9.8 14Z" fill="currentColor"/>
                </svg>
              </button>
              <!-- 隐藏的文件输入框 -->
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                style="display: none" 
                @change="handleFileSelect"
              />
            </div>
            <h2 class="username">{{ userStore.user.username }}</h2>
            <p class="user-email">{{ userStore.user.email || '未绑定邮箱' }}</p>
            <!-- 上传进度提示 -->
            <p v-if="uploadingAvatar" class="upload-hint">
              <svg class="loading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              正在上传头像...
            </p>
          </section>

          <!-- 用户信息卡片 -->
          <section class="info-card glass">
            <div class="card-header">
              <h3>基本信息</h3>
              <button class="edit-toggle" @click="isEditing = !isEditing">
                {{ isEditing ? '取消' : '编辑' }}
              </button>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="label">用户名</span>
                <input 
                  v-if="isEditing" 
                  v-model="form.username" 
                  type="text"
                  class="input"
                  placeholder="请输入用户名"
                />
                <span v-else class="value">{{ userStore.user.username }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱</span>
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
            <button v-if="isEditing" class="save-btn" @click="saveProfile">
              保存修改
            </button>
          </section>
        </div>

        <!-- 右侧：密码修改和操作 -->
        <div class="profile-right">
          <!-- 修改密码卡片 -->
          <section class="password-card glass">
            <div class="card-header">
              <h3>安全设置</h3>
            </div>
            <form class="password-form" @submit.prevent="handleChangePassword">
              <div class="form-item" :class="{ 'has-error': passwordErrors.oldPassword }">
                <label>当前密码</label>
                <div class="input-wrapper">
                  <input 
                    v-model="passwordForm.oldPassword" 
                    :type="showOldPassword ? 'text' : 'password'" 
                    placeholder="请输入当前密码"
                    @blur="validatePasswordField('oldPassword')"
                  />
                  <button type="button" class="toggle-password" @click="showOldPassword = !showOldPassword">
                    <svg v-if="showOldPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <span v-if="passwordErrors.oldPassword" class="error-msg">{{ passwordErrors.oldPassword }}</span>
              </div>
              <div class="form-item" :class="{ 'has-error': passwordErrors.newPassword }">
                <label>新密码</label>
                <div class="input-wrapper">
                  <input 
                    v-model="passwordForm.newPassword" 
                    :type="showNewPassword ? 'text' : 'password'" 
                    placeholder="请输入6-20位新密码"
                    @blur="validatePasswordField('newPassword')"
                  />
                  <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
                    <svg v-if="showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <span v-if="passwordErrors.newPassword" class="error-msg">{{ passwordErrors.newPassword }}</span>
              </div>
              <div class="form-item" :class="{ 'has-error': passwordErrors.confirmPassword }">
                <label>确认新密码</label>
                <div class="input-wrapper">
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    placeholder="请再次输入新密码"
                    @blur="validatePasswordField('confirmPassword')"
                  />
                  <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <span v-if="passwordErrors.confirmPassword" class="error-msg">{{ passwordErrors.confirmPassword }}</span>
              </div>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? '提交中...' : '修改密码' }}
              </button>
            </form>
          </section>

          <!-- 移动端退出登录 -->
          <button class="logout-btn show-mobile" @click="handleLogout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav show-mobile">
      <router-link to="/messages" class="mobile-nav-item">
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
import { updateUserInfo, updatePassword, uploadAvatar } from '@/api/user'
import toast from '@/utils/toast'
import confirm from '@/utils/confirm'

const router = useRouter()
const userStore = useUserStore()

const isEditing = ref(false)
const isSubmitting = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

// 密码显示状态
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  username: '',
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

onMounted(async () => {
  // 加载用户信息
  try {
    await userStore.fetchCurrentUser()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  // 初始化表单
  form.username = userStore.user.username
  form.email = userStore.user.email
})

const goBack = () => {
  router.back()
}

const saveProfile = async () => {
  try {
    await updateUserInfo({ 
      username: form.username,
      email: form.email 
    })
    userStore.setUser({
      ...userStore.user,
      username: form.username,
      email: form.email
    })
    isEditing.value = false
    toast.success('修改成功')
  } catch (error) {
    toast.error(error.message || '修改失败，请重试')
  }
}

const handleLogout = async () => {
  const confirmed = await confirm({
    title: '退出登录',
    message: '确定要退出登录吗？',
    type: 'danger',
    confirmText: '退出',
    cancelText: '取消'
  })
  if (confirmed) {
    await userStore.logout()
    router.push('/login')
  }
}

// 重置密码表单
const resetPasswordForm = () => {
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
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    toast.success('密码修改成功！')
    resetPasswordForm()
  } catch (error) {
    toast.error(error.message || '密码修改失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.error('只支持 JPG、PNG、GIF、WEBP 格式的图片')
    return
  }

  // 验证文件大小（10MB）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('图片大小不能超过 10MB')
    return
  }

  // 上传头像
  uploadingAvatar.value = true
  try {
    const avatarUrl = await uploadAvatar(file)
    // 更新用户信息
    userStore.setUser({
      ...userStore.user,
      avatar: avatarUrl
    })
    toast.success('头像上传成功！')
    // 清空文件输入框
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    toast.error(error.message || '头像上传失败，请重试')
  } finally {
    uploadingAvatar.value = false
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
  
  .logout-btn-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $gray-600;
    background: transparent;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;
    
    svg {
      flex-shrink: 0;
    }
    
    &:hover {
      color: $error-color;
      border-color: $error-color;
      background: rgba($error-color, 0.05);
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

// PC端左右布局容器
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

// 左侧卡片
.profile-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 右侧卡片
.profile-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 头像区域
.avatar-section {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
    
    img {
      width: 80px;
      height: 80px;
      border-radius: $radius-full;
      object-fit: cover;
      border: 4px solid $white;
      box-shadow: $shadow-lg;
    }
    
    .change-avatar-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 28px;
      height: 28px;
      background: $primary-gradient;
      border: 2px solid $white;
      border-radius: $radius-full;
      cursor: pointer;
      color: $white;
      @include flex-center;
      transition: all $transition-fast;
      
      &:hover:not(:disabled) {
        transform: scale(1.1);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
  
  .username {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-800;
    margin: 0 0 4px;
  }
  
  .user-email {
    font-size: $font-size-sm;
    color: $gray-500;
    margin: 0;
  }
  
  .upload-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    font-size: $font-size-xs;
    color: $primary-color;
    
    .loading-icon {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}

// 信息卡片
.info-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  overflow: hidden;
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $gray-100;
    
    h3 {
      font-size: $font-size-base;
      font-weight: 600;
      color: $gray-800;
      margin: 0;
    }
    
    .edit-toggle {
      padding: 6px 12px;
      font-size: $font-size-xs;
      font-weight: 500;
      color: $primary-color;
      background: rgba($primary-color, 0.1);
      border: none;
      border-radius: $radius-sm;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover {
        background: rgba($primary-color, 0.15);
      }
    }
  }
  
  .info-list {
    padding: 8px 0;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    
    .label {
      width: 80px;
      font-size: $font-size-sm;
      color: $gray-500;
      flex-shrink: 0;
    }
    
    .value {
      flex: 1;
      font-size: $font-size-sm;
      color: $gray-800;
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
    }
  }
  
  .save-btn {
    width: calc(100% - 40px);
    margin: 12px 20px 20px;
    padding: 12px;
    font-size: $font-size-sm;
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

// 密码卡片
.password-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  overflow: hidden;
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $gray-100;
    
    h3 {
      font-size: $font-size-base;
      font-weight: 600;
      color: $gray-800;
      margin: 0;
    }
  }
  
  .password-form {
    padding: 20px;
    
    .form-item {
      margin-bottom: 16px;
      
      &:last-of-type {
        margin-bottom: 20px;
      }
      
      label {
        display: block;
        font-size: $font-size-sm;
        font-weight: 500;
        color: $gray-700;
        margin-bottom: 8px;
      }
      
      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        
        input {
          width: 100%;
          padding: 10px 40px 10px 14px;
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
        
        .toggle-password {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: $gray-400;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color $transition-fast;
          
          &:hover {
            color: $primary-color;
          }
        }
      }
      
      &.has-error {
        .input-wrapper input {
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
      padding: 12px;
      font-size: $font-size-sm;
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

// 退出登录按钮（移动端）
.logout-btn {
  width: 100%;
  display: none;
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
  
  @include mobile {
    display: flex;
  }
  
  &:hover {
    background: rgba($error-color, 0.15);
  }
}

// 显示/隐藏工具类
.hide-mobile {
  @include mobile {
    display: none !important;
  }
}

.show-mobile {
  display: none;
  
  @include mobile {
    display: flex;
  }
}

// 修改密码弹窗（移动端保留）
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
