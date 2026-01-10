<template>
  <div 
    class="contact-item"
    :class="{ active: contact.id === selectedId }"
    @click="$emit('click', contact)"
  >
    <div class="avatar-wrapper">
      <img :src="contact.avatar" :alt="contact.nickname" />
      <span class="status-dot" :class="contact.status"></span>
    </div>
    
    <div class="info">
      <span class="name">{{ contact.nickname }}</span>
      <span class="signature">{{ contact.signature || '暂无签名' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contact: {
    type: Object,
    required: true
  },
  selectedId: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background: $gray-50;
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
    
    .name {
      color: $primary-color;
    }
  }
  
  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;
    
    img {
      width: 42px;
      height: 42px;
      border-radius: $radius-full;
      object-fit: cover;
    }
    
    .status-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      border: 2px solid $white;
      border-radius: 50%;
      
      &.online { background: $success-color; }
      &.offline { background: $gray-400; }
      &.busy { background: $error-color; }
      &.away { background: $warning-color; }
    }
  }
  
  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .name {
      font-size: $font-size-sm;
      font-weight: 500;
      color: $gray-800;
      @include text-ellipsis;
    }
    
    .signature {
      font-size: $font-size-xs;
      color: $gray-500;
      @include text-ellipsis;
    }
  }
}
</style>
