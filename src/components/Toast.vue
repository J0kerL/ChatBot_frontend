<template>
  <Teleport to="body">
    <Transition name="toast-fade">
      <div v-if="visible" class="toast-container">
        <div :class="['toast', `toast-${type}`]">
          <div class="toast-icon">
            <!-- 成功图标 -->
            <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
            </svg>
            <!-- 错误图标 -->
            <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
            <!-- 警告图标 -->
            <svg v-else-if="type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
            </svg>
            <!-- 信息图标 -->
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
            </svg>
          </div>
          <span class="toast-message">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
let timer = null

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
      emit('update:modelValue', false)
    }, props.duration)
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  font-weight: 500;
  min-width: 200px;
  max-width: 400px;
  
  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  &-message {
    flex: 1;
    line-height: 1.5;
    color: #333;
  }
  
  &-success {
    border-left: 4px solid #10b981;
    .toast-icon {
      color: #10b981;
    }
  }
  
  &-error {
    border-left: 4px solid #ef4444;
    .toast-icon {
      color: #ef4444;
    }
  }
  
  &-warning {
    border-left: 4px solid #f59e0b;
    .toast-icon {
      color: #f59e0b;
    }
  }
  
  &-info {
    border-left: 4px solid #3b82f6;
    .toast-icon {
      color: #3b82f6;
    }
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
