<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card glass">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" fill="url(#logoGradient)"/>
            <defs>
              <linearGradient id="logoGradient" x1="2" y1="2" x2="22" y2="22">
                <stop stop-color="#10b981"/>
                <stop offset="1" stop-color="#34d399"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">ChatFlow</span>
        </div>
        <p class="subtitle">连接你我，畅聊无限</p>
      </div>

      <!-- 切换Tab -->
      <div class="tab-switch">
        <button 
          :class="['tab-btn', { active: isLogin }]" 
          @click="switchTab(true)"
        >
          登录
        </button>
        <button 
          :class="['tab-btn', { active: !isLogin }]" 
          @click="switchTab(false)"
        >
          注册
        </button>
        <div class="tab-indicator" :style="{ left: isLogin ? '0' : '50%' }"></div>
      </div>

      <!-- 表单容器 -->
      <div class="form-container">
        <transition :name="slideDirection" mode="out-in">
          <form 
            v-if="isLogin" 
            key="login" 
            class="form" 
            @submit.prevent="handleSubmit"
            novalidate
          >
            <!-- 登录表单 -->
            <div class="form-group">
              <label class="form-label">用户名</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.username }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.username" 
                  type="text" 
                  class="input"
                  placeholder="请输入用户名"
                  @blur="validateField('username')"
                  @input="clearError('username')"
                />
              </div>
              <transition name="error-fade">
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.password }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="input"
                  placeholder="请输入密码"
                  @blur="validateField('password')"
                  @input="clearError('password')"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <transition name="error-fade">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </transition>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>登录</span>
            </button>
          </form>

          <form 
            v-else 
            key="register" 
            class="form" 
            @submit.prevent="handleSubmit"
            novalidate
          >
            <!-- 注册表单 -->
            <div class="form-group">
              <label class="form-label">用户名</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.username }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.username" 
                  type="text" 
                  class="input"
                  placeholder="请输入用户名"
                  @blur="validateField('username')"
                  @input="clearError('username')"
                />
              </div>
              <transition name="error-fade">
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.email }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="input"
                  placeholder="请输入邮箱"
                  @blur="validateField('email')"
                  @input="clearError('email')"
                />
              </div>
              <transition name="error-fade">
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.password }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="input"
                  placeholder="请设置密码"
                  @blur="validateField('password')"
                  @input="clearError('password')"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <transition name="error-fade">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">确认密码</label>
              <div class="input-wrapper" :class="{ 'has-error': errors.confirmPassword }">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  v-model="form.confirmPassword" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="input"
                  placeholder="请再次输入密码"
                  @blur="validateField('confirmPassword')"
                  @input="clearError('confirmPassword')"
                />
              </div>
              <transition name="error-fade">
                <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
              </transition>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>注册</span>
            </button>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import toast from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const slideDirection = ref('slide-right')

const form = reactive({
  username: '',
  password: '',
  email: '',
  confirmPassword: ''
})

const errors = reactive({
  username: '',
  password: '',
  email: '',
  confirmPassword: ''
})

// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线或中文' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确格式的邮箱地址' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, max: 20, message: '密码长度为6-20个字符' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    { validator: (value) => value === form.password, message: '两次输入的密码不一致' }
  ]
}

// 验证单个字段
const validateField = (field) => {
  const value = form[field]
  const fieldRules = rules[field]
  
  // 登录时不验证邮箱和确认密码
  if (isLogin.value && (field === 'email' || field === 'confirmPassword')) {
    return true
  }
  
  for (const rule of fieldRules) {
    if (rule.required && !value) {
      errors[field] = rule.message
      return false
    }
    if (rule.min && value.length < rule.min) {
      errors[field] = rule.message
      return false
    }
    if (rule.max && value.length > rule.max) {
      errors[field] = rule.message
      return false
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message
      return false
    }
    if (rule.validator && !rule.validator(value)) {
      errors[field] = rule.message
      return false
    }
  }
  
  errors[field] = ''
  return true
}

// 清除错误
const clearError = (field) => {
  errors[field] = ''
}

// 验证表单
const validateForm = () => {
  const fieldsToValidate = isLogin.value 
    ? ['username', 'password'] 
    : ['username', 'email', 'password', 'confirmPassword']
  
  let isValid = true
  for (const field of fieldsToValidate) {
    if (!validateField(field)) {
      isValid = false
    }
  }
  return isValid
}

// 切换标签页
const switchTab = (toLogin) => {
  if (toLogin === isLogin.value) return
  
  // 设置滑动方向
  slideDirection.value = toLogin ? 'slide-right' : 'slide-left'
  
  // 清除表单和错误
  Object.keys(form).forEach(key => form[key] = '')
  Object.keys(errors).forEach(key => errors[key] = '')
  
  isLogin.value = toLogin
}

const handleSubmit = async () => {
  // 先验证表单
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    if (isLogin.value) {
      // 登录逻辑 - 调用真实API
      await userStore.login({
        username: form.username,
        password: form.password
      })
      // 登录成功先提示，再跳转
      toast.success('登录成功')
      setTimeout(() => {
        router.push('/messages')
      }, 800)
    } else {
      // 注册逻辑 - 调用真实API
      await userStore.register({
        username: form.username,
        password: form.password,
        email: form.email
      })
      // 注册成功后提示并切换到登录
      toast.success('注册成功，请登录')
      switchTab(true)
    }
  } catch (error) {
    console.error('提交失败:', error)
    toast.error(error.message || '操作失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  
  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    
    &.circle-1 {
      width: 300px;
      height: 300px;
      top: -80px;
      right: -80px;
      animation: float 8s ease-in-out infinite;
    }
    
    &.circle-2 {
      width: 200px;
      height: 200px;
      bottom: -40px;
      left: -40px;
      animation: float 10s ease-in-out infinite reverse;
    }
    
    &.circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 4s ease-in-out infinite;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 28px 24px;
  border-radius: $radius-xl;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  box-shadow: $shadow-2xl;
  animation: fadeIn 0.5s ease;
  
  @include mobile {
    padding: 24px 20px;
    max-width: 100%;
    border-radius: $radius-lg;
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 20px;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 8px;
    
    svg {
      width: 36px;
      height: 36px;
      
      @include mobile {
        width: 32px;
        height: 32px;
      }
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      @include mobile {
        font-size: 22px;
      }
    }
  }
  
  .subtitle {
    color: $gray-500;
    font-size: $font-size-sm;
  }
}

.tab-switch {
  display: flex;
  position: relative;
  background: $gray-100;
  border-radius: $radius-md;
  padding: 3px;
  margin-bottom: 20px;
  
  .tab-btn {
    flex: 1;
    padding: 8px;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $gray-500;
    background: transparent;
    border: none;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all $transition-fast;
    position: relative;
    z-index: 1;
    
    &.active {
      color: $white;
    }
  }
  
  .tab-indicator {
    position: absolute;
    top: 3px;
    width: calc(50% - 3px);
    height: calc(100% - 6px);
    background: $primary-gradient;
    border-radius: $radius-sm;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 表单容器
.form-container {
  position: relative;
  overflow: hidden;
}

.form {
  .form-group {
    margin-bottom: 14px;
  }
  
  .form-label {
    display: block;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $gray-700;
    margin-bottom: 6px;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
    .input-icon {
      position: absolute;
      left: 12px;
      color: $gray-400;
      display: flex;
      align-items: center;
      transition: color 0.2s ease;
    }
    
    .input {
      width: 100%;
      padding: 10px 40px;
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
        box-shadow: 0 0 0 3px rgba($primary-color, 0.15);
      }
    }
    
    // 错误状态
    &.has-error {
      .input {
        border-color: #ef4444;
        background: #fef2f2;
        
        &:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
      }
      
      .input-icon {
        color: #ef4444;
      }
    }
    
    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: $gray-400;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      
      &:hover {
        color: $primary-color;
      }
    }
  }
}

// 错误消息样式
.error-message {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
  
  &::before {
    content: '';
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    flex-shrink: 0;
  }
}

// 错误消息动画
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// 滑动动画 - 向左滑
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 滑动动画 - 向右滑
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  font-size: $font-size-base;
  font-weight: 600;
  color: $white;
  background: $primary-gradient;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-float;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: $white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
