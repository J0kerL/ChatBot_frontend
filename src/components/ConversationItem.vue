<template>
  <div 
    class="conversation-item"
    :class="{ active }"
    @click="$emit('click')"
  >
    <div class="avatar-wrapper">
      <img :src="conversation.avatar" :alt="conversation.name" />
      <span v-if="conversation.online" class="online-indicator"></span>
      <span v-if="conversation.type === 'group'" class="group-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z" fill="currentColor"/>
        </svg>
      </span>
    </div>
    
    <div class="content">
      <div class="top-row">
        <span class="name">{{ conversation.name }}</span>
        <span class="time">{{ formatTime(conversation.lastTime) }}</span>
      </div>
      <div class="bottom-row">
        <p class="last-message">{{ conversation.lastMessage }}</p>
        <span v-if="conversation.unread > 0" class="unread-badge">
          {{ conversation.unread > 99 ? '99+' : conversation.unread }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '@/mock/data'

defineProps({
  conversation: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  margin-bottom: 4px;
  
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
      width: 48px;
      height: 48px;
      border-radius: $radius-full;
      object-fit: cover;
    }
    
    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background: $success-color;
      border: 2px solid $white;
      border-radius: 50%;
    }
    
    .group-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      background: $primary-gradient;
      border: 2px solid $white;
      border-radius: 50%;
      @include flex-center;
      color: $white;
    }
  }
  
  .content {
    flex: 1;
    min-width: 0;
    
    .top-row {
      @include flex-between;
      margin-bottom: 4px;
      
      .name {
        font-size: $font-size-sm;
        font-weight: 600;
        color: $gray-800;
        @include text-ellipsis;
      }
      
      .time {
        font-size: $font-size-xs;
        color: $gray-400;
        flex-shrink: 0;
        margin-left: 8px;
      }
    }
    
    .bottom-row {
      @include flex-between;
      
      .last-message {
        flex: 1;
        font-size: $font-size-xs;
        color: $gray-500;
        @include text-ellipsis;
      }
      
      .unread-badge {
        min-width: 18px;
        height: 18px;
        padding: 0 6px;
        font-size: 11px;
        font-weight: 600;
        color: $white;
        background: $error-color;
        border-radius: $radius-full;
        @include flex-center;
        flex-shrink: 0;
        margin-left: 8px;
      }
    }
  }
}
</style>
