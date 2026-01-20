// 全局对话框实例
let dialogInstance = null

// 设置对话框实例
export const setDialogInstance = (instance) => {
  dialogInstance = instance
}

// 显示警告对话框
export const showAlert = (message, options = {}) => {
  if (!dialogInstance) {
    console.error('Dialog instance not initialized')
    return Promise.resolve(true)
  }
  
  return dialogInstance.show({
    type: 'alert',
    message,
    title: options.title || '提示',
    confirmText: options.confirmText || '确定',
    confirmType: options.confirmType || 'primary'
  })
}

// 显示确认对话框
export const showConfirm = (message, options = {}) => {
  if (!dialogInstance) {
    console.error('Dialog instance not initialized')
    return Promise.resolve(false)
  }
  
  return dialogInstance.show({
    type: 'confirm',
    message,
    title: options.title || '确认',
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
    confirmType: options.confirmType || 'primary'
  })
}

// 显示删除确认对话框
export const showDeleteConfirm = (message, options = {}) => {
  return showConfirm(message, {
    title: options.title || '确认删除',
    confirmText: options.confirmText || '删除',
    cancelText: options.cancelText || '取消',
    confirmType: 'danger'
  })
}

// 显示警告确认对话框
export const showWarningConfirm = (message, options = {}) => {
  return showConfirm(message, {
    title: options.title || '警告',
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
    confirmType: 'warning'
  })
}
