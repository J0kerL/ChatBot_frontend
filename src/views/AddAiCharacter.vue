<template>
  <div class="add-ai-page">
    <div class="form-container">
      <div class="form-header">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          <span>返回</span>
        </button>
        <h1>添加联系人</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="ai-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <h2 class="section-title">基本信息</h2>
          
          <div class="form-group">
            <label class="required">角色名称</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="例如：小艾" 
              maxlength="20"
              required
            />
          </div>

          <div class="form-group">
            <label>身份关系</label>
            <input 
              v-model="formData.relationship" 
              type="text" 
              placeholder="例如：温柔女友、知心姐姐" 
              maxlength="20"
            />
          </div>

          <div class="form-group">
            <label>年龄</label>
            <input 
              v-model.number="formData.age" 
              type="number" 
              placeholder="例如：22" 
              min="1"
              max="150"
            />
          </div>
        </div>

        <!-- 外貌与性格 -->
        <div class="form-section">
          <h2 class="section-title">外貌与性格</h2>
          
          <div class="form-group">
            <label>外貌描述</label>
            <textarea 
              v-model="formData.appearance" 
              placeholder="描述联系人的外貌特征..." 
              rows="3"
              maxlength="200"
            ></textarea>
          </div>

          <div class="form-group">
            <label>性格标签</label>
            <div class="tags-input" :class="{ 'focused': tagInputFocused }">
              <span 
                v-for="(tag, index) in formData.personalityTags" 
                :key="index"
                class="tag"
              >
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="tag-remove">×</button>
              </span>
              <div class="tag-input-wrapper">
                <input 
                  ref="tagInput"
                  v-model="newTag"
                  type="text" 
                  placeholder="输入标签" 
                  @keydown.enter.prevent="addTag"
                  @focus="tagInputFocused = true"
                  @blur="tagInputFocused = false"
                  maxlength="10"
                />
                <button 
                  v-if="newTag.trim()"
                  type="button" 
                  class="btn-add-tag"
                  @click="addTag"
                >
                  添加
                </button>
              </div>
            </div>
            <p class="form-hint">例如：温柔、体贴、幽默（最多10个）</p>
          </div>
        </div>

        <!-- 背景与风格 -->
        <div class="form-section">
          <h2 class="section-title">背景与风格</h2>
          
          <div class="form-group">
            <label>背景故事</label>
            <textarea 
              v-model="formData.background" 
              placeholder="介绍联系人的背景故事..." 
              rows="4"
              maxlength="500"
            ></textarea>
          </div>

          <div class="form-group">
            <label>说话风格</label>
            <textarea 
              v-model="formData.speakingStyle" 
              placeholder="描述联系人的说话风格和语气..." 
              rows="3"
              maxlength="200"
            ></textarea>
          </div>

          <div class="form-group">
            <label>记忆设定</label>
            <textarea 
              v-model="formData.memorySettings" 
              placeholder="设定联系人的记忆能力和上下文..." 
              rows="3"
              maxlength="200"
            ></textarea>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="goBack">取消</button>
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? '创建中...' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { addAiCharacter } from '@/api/aiCharacter'
import { showAlert, showWarningConfirm } from '@/utils/dialog'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const newTag = ref('')
const tagInputFocused = ref(false)
const tagInput = ref(null)

const formData = reactive({
  name: '',
  relationship: '',
  age: null,
  appearance: '',
  personalityTags: [],
  background: '',
  speakingStyle: '',
  memorySettings: '',
  userId: null
})

const addTag = async () => {
  const tag = newTag.value.trim()
  if (tag && !formData.personalityTags.includes(tag)) {
    if (formData.personalityTags.length >= 10) {
      await showAlert('最多添加10个标签', { confirmType: 'warning' })
      return
    }
    formData.personalityTags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  formData.personalityTags.splice(index, 1)
}

const handleSubmit = async () => {
  if (submitting.value) return
  
  // 验证必填字段
  if (!formData.name.trim()) {
    await showAlert('请输入角色名称', { confirmType: 'warning' })
    return
  }
  
  try {
    submitting.value = true
    
    // 获取当前用户ID
    const userId = userStore.user?.id
    if (!userId) {
      await showAlert('用户未登录', { confirmType: 'danger' })
      return
    }
    
    const data = {
      ...formData,
      userId
    }
    
    await addAiCharacter(data)
    await showAlert('创建成功！', { confirmType: 'primary' })
    router.push('/contacts')
  } catch (error) {
    await showAlert('创建失败: ' + error.message, { confirmType: 'danger' })
  } finally {
    submitting.value = false
  }
}

const goBack = async () => {
  const confirmed = await showWarningConfirm('确定要放弃创建吗？')
  if (confirmed) {
    router.push('/contacts')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.add-ai-page {
  min-height: 100vh;
  background: $bg-primary;
  padding: 20px;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.form-header {
  padding: 24px 30px;
  border-bottom: 1px solid $gray-100;
  
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    margin-bottom: 16px;
    background: $gray-50;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $gray-700;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      background: $gray-100;
    }
  }
  
  h1 {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $gray-800;
  }
}

.ai-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 32px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $gray-800;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid $primary-color;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: $gray-50;
  border-radius: $radius-lg;
  
  .avatar-preview {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: $radius-full;
      object-fit: cover;
      border: 4px solid $white;
      box-shadow: $shadow-sm;
    }
  }
  
  .upload-info {
    flex: 1;
    
    h3 {
      font-size: $font-size-base;
      font-weight: 600;
      color: $gray-800;
      margin-bottom: 8px;
    }
    
    p {
      font-size: $font-size-sm;
      color: $gray-500;
      margin-bottom: 16px;
    }
    
    .btn-upload {
      padding: 10px 20px;
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

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $gray-700;
    margin-bottom: 8px;
    
    &.required::after {
      content: ' *';
      color: $error-color;
    }
  }
  
  input[type="text"],
  input[type="number"],
  textarea {
    width: 100%;
    padding: 12px 16px;
    background: $white;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $gray-800;
    transition: all $transition-fast;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    &::placeholder {
      color: $gray-400;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }
  
  .form-hint {
    margin-top: 6px;
    font-size: $font-size-xs;
    color: $gray-500;
  }
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  min-height: 46px;
  transition: all $transition-fast;
  
  &:focus-within,
  &.focused {
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(16, 185, 129, 0.1);
    color: $primary-color;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    
    .tag-remove {
      padding: 0;
      width: 16px;
      height: 16px;
      background: rgba(16, 185, 129, 0.2);
      border: none;
      border-radius: 50%;
      color: $primary-color;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      transition: all $transition-fast;
      
      &:hover {
        background: $primary-color;
        color: $white;
      }
    }
  }
  
  .tag-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    
    @include mobile {
      min-width: 100%;
    }
    
    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: $font-size-sm;
      min-width: 80px;
      
      &::placeholder {
        color: $gray-400;
      }
    }
    
    .btn-add-tag {
      padding: 6px 16px;
      background: $primary-gradient;
      color: $white;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-xs;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all $transition-fast;
      
      @include mobile {
        padding: 8px 20px;
        font-size: $font-size-sm;
      }
      
      &:hover {
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid $gray-100;
  
  button {
    padding: 12px 32px;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-base;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-fast;
  }
  
  .btn-cancel {
    background: $gray-100;
    color: $gray-700;
    
    &:hover {
      background: $gray-200;
    }
  }
  
  .btn-submit {
    background: $primary-gradient;
    color: $white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-float;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
