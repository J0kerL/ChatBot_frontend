import { createApp, ref, h } from 'vue'
import ConfirmComponent from '@/components/Confirm.vue'

/**
 * 显示确认对话框
 * @param {Object|String} options - 配置选项或消息文本
 * @returns {Promise<boolean>} - 用户点击确认返回true，取消返回false
 */
export function confirm(options) {
  return new Promise((resolve) => {
    const config = typeof options === 'string' 
      ? { message: options } 
      : options

    const {
      title = '提示',
      message = '',
      type = 'warning',
      confirmText = '确定',
      cancelText = '取消'
    } = config

    // 创建挂载点
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const visible = ref(true)

    const app = createApp({
      setup() {
        const handleConfirm = () => {
          resolve(true)
          cleanup()
        }

        const handleCancel = () => {
          resolve(false)
          cleanup()
        }

        const cleanup = () => {
          visible.value = false
          setTimeout(() => {
            app.unmount()
            mountNode.remove()
          }, 300)
        }

        return () => h(ConfirmComponent, {
          title,
          message,
          type,
          confirmText,
          cancelText,
          modelValue: visible.value,
          'onUpdate:modelValue': (val) => {
            if (!val) {
              resolve(false)
              cleanup()
            }
          },
          onConfirm: handleConfirm,
          onCancel: handleCancel
        })
      }
    })

    app.mount(mountNode)
  })
}

export default confirm
