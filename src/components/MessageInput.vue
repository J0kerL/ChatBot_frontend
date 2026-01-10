<template>
  <div class="message-input">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button class="tool-btn" title="表情">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor"/>
        </svg>
      </button>
      <button class="tool-btn" title="图片">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
        </svg>
      </button>
      <button class="tool-btn" title="文件">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M16.5 6V17.5C16.5 19.71 14.71 21.5 12.5 21.5C10.29 21.5 8.5 19.71 8.5 17.5V5C8.5 3.62 9.62 2.5 11 2.5C12.38 2.5 13.5 3.62 13.5 5V15.5C13.5 16.05 13.05 16.5 12.5 16.5C11.95 16.5 11.5 16.05 11.5 15.5V6H10V15.5C10 16.88 11.12 18 12.5 18C13.88 18 15 16.88 15 15.5V5C15 2.79 13.21 1 11 1C8.79 1 7 2.79 7 5V17.5C7 20.54 9.46 23 12.5 23C15.54 23 18 20.54 18 17.5V6H16.5Z" fill="currentColor"/>
        </svg>
      </button>
      <button class="tool-btn" title="语音">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 14C13.66 14 14.99 12.66 14.99 11L15 5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.3 11C17.3 14 14.76 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.24 19 14.42 19 11H17.3Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-wrapper glass">
        <textarea 
          ref="textareaRef"
          v-model="message"
          placeholder="输入消息..."
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift="handleShiftEnter"
          @input="autoResize"
          rows="1"
        ></textarea>
        
        <button 
          class="send-btn"
          :class="{ active: message.trim() }"
          :disabled="!message.trim()"
          @click="sendMessage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const emit = defineEmits(['send'])

const message = ref('')
const textareaRef = ref(null)

const sendMessage = () => {
  if (!message.value.trim()) return
  
  emit('send', message.value)
  message.value = ''
  
  nextTick(() => {
    resetTextareaHeight()
  })
}

const handleShiftEnter = () => {
  // Shift + Enter 换行，不发送
}

const autoResize = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    const maxHeight = 120
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
  }
}

const resetTextareaHeight = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.message-input {
  padding: 16px 24px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  @include mobile {
    padding: 12px 16px 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
  }
  
  .toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .tool-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: $radius-md;
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
  
  .input-area {
    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: $radius-lg;
      border: 2px solid transparent;
      transition: all $transition-fast;
      
      &:focus-within {
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
      }
      
      textarea {
        flex: 1;
        min-height: 24px;
        max-height: 120px;
        padding: 0;
        font-size: $font-size-sm;
        font-family: inherit;
        color: $gray-800;
        background: transparent;
        border: none;
        outline: none;
        resize: none;
        line-height: 1.5;
        
        &::placeholder {
          color: $gray-400;
        }
        
        @include custom-scrollbar;
      }
      
      .send-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: $gray-200;
        border-radius: $radius-full;
        cursor: pointer;
        color: $gray-400;
        @include flex-center;
        transition: all $transition-fast;
        flex-shrink: 0;
        
        &.active {
          background: $primary-gradient;
          color: $white;
          
          &:hover {
            transform: scale(1.05);
            box-shadow: $shadow-float;
          }
        }
        
        &:disabled {
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
