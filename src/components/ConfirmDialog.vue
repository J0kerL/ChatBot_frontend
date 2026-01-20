<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
        <div class="dialog-container" @click.stop>
          <div class="dialog-header" v-if="title">
            <h3>{{ title }}</h3>
          </div>
          <div class="dialog-body">
            <p>{{ message }}</p>
          </div>
          <div class="dialog-footer">
            <button 
              v-if="type === 'confirm'" 
              class="btn-cancel" 
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button 
              class="btn-confirm" 
              :class="confirmType"
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
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const type = ref('alert') // 'alert' or 'confirm'
const confirmText = ref('确定')
const cancelText = ref('取消')
const confirmType = ref('primary') // 'primary', 'danger', 'warning'

let resolvePromise = null

const show = (options) => {
  return new Promise((resolve) => {
    visible.value = true
    title.value = options.title || ''
    message.value = options.message || ''
    type.value = options.type || 'alert'
    confirmText.value = options.confirmText || '确定'
    cancelText.value = options.cancelText || '取消'
    confirmType.value = options.confirmType || 'primary'
    resolvePromise = resolve
  })
}

const handleConfirm = () => {
  visible.value = false
  resolvePromise && resolvePromise(true)
}

const handleCancel = () => {
  visible.value = false
  resolvePromise && resolvePromise(false)
}

const handleOverlayClick = () => {
  if (type.value === 'alert') {
    handleConfirm()
  } else {
    handleCancel()
  }
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: $white;
  border-radius: $radius-xl;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 360px;
  max-width: 500px;
  overflow: hidden;
  animation: dialog-bounce 0.3s ease-out;
  
  @include mobile {
    min-width: 300px;
    max-width: calc(100vw - 40px);
  }
}

.dialog-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid $gray-100;
  
  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $gray-800;
    margin: 0;
  }
}

.dialog-body {
  padding: 24px;
  
  p {
    font-size: $font-size-base;
    color: $gray-700;
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
  }
}

.dialog-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: $gray-50;
  
  button {
    padding: 10px 24px;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-fast;
    min-width: 80px;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .btn-cancel {
    background: $white;
    color: $gray-700;
    border: 1px solid $gray-200;
    
    &:hover {
      background: $gray-50;
      border-color: $gray-300;
    }
  }
  
  .btn-confirm {
    color: $white;
    
    &.primary {
      background: $primary-gradient;
      
      &:hover {
        opacity: 0.9;
      }
    }
    
    &.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      
      &:hover {
        opacity: 0.9;
      }
    }
    
    &.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}

// 动画
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
  
  .dialog-container {
    transition: transform 0.3s ease;
  }
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  
  .dialog-container {
    transform: scale(0.9);
  }
}

@keyframes dialog-bounce {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
