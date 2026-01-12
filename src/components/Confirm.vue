<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="confirm-overlay" @click.self="handleCancel">
        <div class="confirm-modal">
          <div class="confirm-icon" :class="`confirm-icon-${type}`">
            <!-- 警告图标 -->
            <svg v-if="type === 'warning'" width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
            <!-- 危险图标 -->
            <svg v-else-if="type === 'danger'" width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="currentColor"/>
            </svg>
            <!-- 信息图标 -->
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button class="confirm-btn confirm-btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button 
              :class="['confirm-btn', 'confirm-btn-confirm', `confirm-btn-${type}`]" 
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
}, { immediate: true })

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.confirm-modal {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modalBounce 0.3s ease;
}

@keyframes modalBounce {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  &-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
  
  &-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  &-info {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
}

.confirm-message {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 12px;
}

.confirm-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &-cancel {
    background: #f3f4f6;
    color: #6b7280;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &-confirm {
    color: white;
    
    &.confirm-btn-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      
      &:hover {
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        transform: translateY(-2px);
      }
    }
    
    &.confirm-btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      
      &:hover {
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        transform: translateY(-2px);
      }
    }
    
    &.confirm-btn-info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      
      &:hover {
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        transform: translateY(-2px);
      }
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  
  .confirm-modal {
    transform: scale(0.9);
  }
}
</style>
