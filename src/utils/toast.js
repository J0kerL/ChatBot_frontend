import { createApp, ref, h } from 'vue'
import Toast from '@/components/Toast.vue'

// Toast 单例容器
let toastContainer = null
let toastApp = null

// 创建Toast容器
function createToastContainer() {
  if (toastContainer) return

  toastContainer = document.createElement('div')
  toastContainer.id = 'toast-container'
  document.body.appendChild(toastContainer)
}

// Toast队列
const toastQueue = ref([])
let toastId = 0

// 显示Toast
function showToast(options) {
  createToastContainer()

  const id = ++toastId
  const { message, type = 'info', duration = 3000 } = typeof options === 'string' 
    ? { message: options } 
    : options

  // 创建临时挂载点
  const mountNode = document.createElement('div')
  toastContainer.appendChild(mountNode)

  const visible = ref(true)
  
  const app = createApp({
    setup() {
      return () => h(Toast, {
        message,
        type,
        duration,
        modelValue: visible.value,
        'onUpdate:modelValue': (val) => {
          visible.value = val
          if (!val) {
            setTimeout(() => {
              app.unmount()
              mountNode.remove()
            }, 300)
          }
        }
      })
    }
  })

  app.mount(mountNode)
}

// 快捷方法
export const toast = {
  show: showToast,
  success: (message, duration) => showToast({ message, type: 'success', duration }),
  error: (message, duration) => showToast({ message, type: 'error', duration }),
  warning: (message, duration) => showToast({ message, type: 'warning', duration }),
  info: (message, duration) => showToast({ message, type: 'info', duration })
}

export default toast
