// Mock头像生成
const getAvatar = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`

// Mock会话数据
export const mockConversations = [
  {
    id: '1',
    type: 'private',
    name: '小明',
    avatar: getAvatar('xiaoming'),
    lastMessage: '好的，明天见！',
    lastTime: '2026-01-09T10:30:00',
    unread: 2,
    online: true
  }
]

// Mock消息数据
export const mockMessages = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      content: '在吗？',
      type: 'text',
      sender: 'other',
      senderName: '小明',
      senderAvatar: getAvatar('xiaoming'),
      timestamp: '2026-01-09T10:00:00',
      status: 'read'
    },
    {
      id: 'm2',
      conversationId: '1',
      content: '在的，怎么了？',
      type: 'text',
      sender: 'self',
      timestamp: '2026-01-09T10:02:00',
      status: 'read'
    },
    {
      id: 'm3',
      conversationId: '1',
      content: '明天有空吗？想约你出来聊聊项目的事情',
      type: 'text',
      sender: 'other',
      senderName: '小明',
      senderAvatar: getAvatar('xiaoming'),
      timestamp: '2026-01-09T10:05:00',
      status: 'read'
    },
    {
      id: 'm4',
      conversationId: '1',
      content: '可以啊，下午的话我都有空',
      type: 'text',
      sender: 'self',
      timestamp: '2026-01-09T10:10:00',
      status: 'read'
    },
    {
      id: 'm5',
      conversationId: '1',
      content: '那就明天下午3点，老地方见？',
      type: 'text',
      sender: 'other',
      senderName: '小明',
      senderAvatar: getAvatar('xiaoming'),
      timestamp: '2026-01-09T10:15:00',
      status: 'read'
    },
    {
      id: 'm6',
      conversationId: '1',
      content: '没问题！',
      type: 'text',
      sender: 'self',
      timestamp: '2026-01-09T10:20:00',
      status: 'read'
    },
    {
      id: 'm7',
      conversationId: '1',
      content: '好的，明天见！',
      type: 'text',
      sender: 'other',
      senderName: '小明',
      senderAvatar: getAvatar('xiaoming'),
      timestamp: '2026-01-09T10:30:00',
      status: 'delivered'
    }
  ],
  '2': [
    {
      id: 'm21',
      conversationId: '2',
      content: '最近忙什么呢？',
      type: 'text',
      sender: 'other',
      senderName: '小红',
      senderAvatar: getAvatar('xiaohong'),
      timestamp: '2026-01-09T08:30:00',
      status: 'read'
    },
    {
      id: 'm22',
      conversationId: '2',
      content: '在做一个新的前端项目，挺忙的',
      type: 'text',
      sender: 'self',
      timestamp: '2026-01-09T08:45:00',
      status: 'read'
    },
    {
      id: 'm23',
      conversationId: '2',
      content: '那个项目进展怎么样了？',
      type: 'text',
      sender: 'other',
      senderName: '小红',
      senderAvatar: getAvatar('xiaohong'),
      timestamp: '2026-01-09T09:15:00',
      status: 'read'
    }
  ],
  '3': [
    {
      id: 'm31',
      conversationId: '3',
      content: '各位，新版本的UI稿已经确定了',
      type: 'text',
      sender: 'other',
      senderName: '张经理',
      senderAvatar: getAvatar('manager-zhang'),
      timestamp: '2026-01-09T08:00:00',
      status: 'read'
    },
    {
      id: 'm32',
      conversationId: '3',
      content: '收到，我这就开始开发',
      type: 'text',
      sender: 'self',
      timestamp: '2026-01-09T08:10:00',
      status: 'read'
    },
    {
      id: 'm33',
      conversationId: '3',
      content: '我负责后端接口对接',
      type: 'text',
      sender: 'other',
      senderName: '小李',
      senderAvatar: getAvatar('xiaoli'),
      timestamp: '2026-01-09T08:20:00',
      status: 'read'
    },
    {
      id: 'm34',
      conversationId: '3',
      content: '代码已经提交了',
      type: 'text',
      sender: 'other',
      senderName: '小李',
      senderAvatar: getAvatar('xiaoli'),
      timestamp: '2026-01-09T08:45:00',
      status: 'read'
    }
  ]
}

// Mock联系人数据
export const mockContacts = [
  {
    id: 'c1',
    username: 'xiaoming',
    nickname: '小明',
    avatar: getAvatar('xiaoming'),
    status: 'online',
    signature: '生活不止眼前的代码，还有诗和远方',
    email: 'xiaoming@example.com',
    phone: '138****1234'
  }
]

// 工具函数：格式化时间
export const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  
  // 本周
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

// 工具函数：格式化完整时间
export const formatFullTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
