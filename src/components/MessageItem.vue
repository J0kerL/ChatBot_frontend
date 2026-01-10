<template>
  <div 
    class="message-item"
    :class="{ 
      'self': message.sender === 'self',
      'other': message.sender === 'other'
    }"
  >
    <!-- 对方消息头像 -->
    <div v-if="message.sender === 'other'" class="avatar">
      <img :src="message.senderAvatar" :alt="message.senderName" />
    </div>
    
    <div class="message-content">
      <!-- 发送者名称（群聊时显示） -->
      <span v-if="message.sender === 'other' && message.senderName" class="sender-name">
        {{ message.senderName }}
      </span>
      
      <!-- 消息气泡 -->
      <div class="bubble" :class="message.type">
        <!-- 文本消息 -->
        <template v-if="message.type === 'text'">
          <p class="text">{{ message.content }}</p>
        </template>
        
        <!-- 图片消息 -->
        <template v-else-if="message.type === 'image'">
          <img :src="message.content" alt="图片" class="image-content" @click="previewImage" />
        </template>
        
        <!-- 文件消息 -->
        <template v-else-if="message.type === 'file'">
          <div class="file-content">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
            <div class="file-info">
              <span class="file-name">{{ message.fileName }}</span>
              <span class="file-size">{{ message.fileSize }}</span>
            </div>
          </div>
        </template>
      </div>
      
      <!-- 消息时间和状态 -->
      <div class="message-meta">
        <span class="time">{{ formatMessageTime(message.timestamp) }}</span>
        <span v-if="message.sender === 'self'" class="status">
          <svg v-if="message.status === 'sent'" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
          </svg>
          <svg v-else-if="message.status === 'delivered'" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 7L16.59 5.59L10.25 11.93L11.66 13.34L18 7ZM22.24 5.59L11.66 16.17L7.48 12L6.07 13.41L11.66 19L23.66 7L22.24 5.59ZM0.41 13.41L6 19L7.41 17.59L1.83 12L0.41 13.41Z" fill="currentColor"/>
          </svg>
          <svg v-else-if="message.status === 'read'" width="14" height="14" viewBox="0 0 24 24" fill="none" class="read">
            <path d="M18 7L16.59 5.59L10.25 11.93L11.66 13.34L18 7ZM22.24 5.59L11.66 16.17L7.48 12L6.07 13.41L11.66 19L23.66 7L22.24 5.59ZM0.41 13.41L6 19L7.41 17.59L1.83 12L0.41 13.41Z" fill="currentColor"/>
          </svg>
        </span>
      </div>
    </div>
    
    <!-- 自己消息头像（可选） -->
    <!-- <div v-if="message.sender === 'self'" class="avatar self-avatar">
      <img :src="userAvatar" alt="我" />
    </div> -->
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const previewImage = () => {
  // 图片预览逻辑
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
  
  &.self {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
    }
    
    .bubble {
      background: $primary-gradient;
      color: $white;
      border-radius: $radius-lg $radius-lg 4px $radius-lg;
      
      &::before {
        content: '';
        position: absolute;
        right: -6px;
        bottom: 0;
        width: 12px;
        height: 12px;
        background: linear-gradient(135deg, #34d399 0%, #34d399 100%);
        clip-path: polygon(0 0, 100% 100%, 0 100%);
      }
    }
    
    .message-meta {
      flex-direction: row-reverse;
      
      .status {
        color: $gray-400;
        
        .read {
          color: $primary-color;
        }
      }
    }
  }
  
  &.other {
    .message-content {
      align-items: flex-start;
    }
    
    .bubble {
      background: $white;
      color: $gray-800;
      border-radius: $radius-lg $radius-lg $radius-lg 4px;
      box-shadow: $shadow-sm;
      
      &::before {
        content: '';
        position: absolute;
        left: -6px;
        bottom: 0;
        width: 12px;
        height: 12px;
        background: $white;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
      }
    }
  }
  
  .avatar {
    flex-shrink: 0;
    
    img {
      width: 36px;
      height: 36px;
      border-radius: $radius-full;
      object-fit: cover;
    }
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    
    @include mobile {
      max-width: 85%;
    }
    
    .sender-name {
      font-size: $font-size-xs;
      color: $gray-500;
      margin-bottom: 4px;
      padding-left: 4px;
    }
  }
  
  .bubble {
    position: relative;
    padding: 12px 16px;
    max-width: 100%;
    word-wrap: break-word;
    word-break: break-word;
    
    .text {
      font-size: $font-size-sm;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
    
    .image-content {
      max-width: 240px;
      max-height: 300px;
      border-radius: $radius-sm;
      cursor: pointer;
      transition: transform $transition-fast;
      
      &:hover {
        transform: scale(1.02);
      }
    }
    
    .file-content {
      display: flex;
      align-items: center;
      gap: 12px;
      
      svg {
        color: $primary-color;
        flex-shrink: 0;
      }
      
      .file-info {
        display: flex;
        flex-direction: column;
        
        .file-name {
          font-size: $font-size-sm;
          font-weight: 500;
          @include text-ellipsis;
        }
        
        .file-size {
          font-size: $font-size-xs;
          color: $gray-500;
          margin-top: 2px;
        }
      }
    }
  }
  
  .message-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding: 0 4px;
    
    .time {
      font-size: 11px;
      color: $gray-400;
    }
    
    .status {
      display: flex;
      align-items: center;
    }
  }
}
</style>
