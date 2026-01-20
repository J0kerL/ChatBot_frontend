<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { setDialogInstance } from '@/utils/dialog'

const userStore = useUserStore()
const dialogRef = ref(null)

onMounted(() => {
  userStore.loadUser()
  // 设置全局对话框实例
  if (dialogRef.value) {
    setDialogInstance(dialogRef.value)
  }
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <ConfirmDialog ref="dialogRef" />
</template>

<style lang="scss">
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
