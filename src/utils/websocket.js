/**
 * WebSocket 管理类
 */
class WebSocketManager {
  constructor() {
    this.ws = null
    this.reconnectTimer = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageHandlers = []
    this.isManualClose = false
    this.heartbeatTimer = null
    this.heartbeatInterval = 30000 // 30秒心跳
  }

  /**
   * 连接WebSocket
   * @param {string} token - 用户token
   */
  connect(token) {
    if (!token) {
      console.error('WebSocket连接失败: token为空')
      return
    }

    // 如果已经连接或正在连接，不重复连接
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket已连接或正在连接中，跳过重复连接')
      return
    }

    // 如果已经连接，先关闭
    if (this.ws) {
      this.close()
    }

    this.isManualClose = false
    
    // 构建WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = import.meta.env.DEV ? '8080' : window.location.port
    // 注意：后端配置了context-path为/api，所以WebSocket路径是/api/ws/chat
    const wsUrl = `${protocol}//${host}:${port}/api/ws/chat?token=${token}`

    console.log('正在连接WebSocket:', wsUrl)

    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket连接成功')
        this.reconnectAttempts = 0
        this.clearReconnectTimer()
        this.startHeartbeat()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('WebSocket消息解析失败:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket连接关闭', event.code, event.reason)
        this.ws = null
        this.stopHeartbeat()
        
        // 如果不是手动关闭且不是正常关闭（1000），尝试重连
        if (!this.isManualClose && event.code !== 1000) {
          this.reconnect(token)
        }
      }
    } catch (error) {
      console.error('WebSocket连接失败:', error)
      this.reconnect(token)
    }
  }

  /**
   * 重连
   */
  reconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket重连次数已达上限')
      return
    }

    this.clearReconnectTimer()
    
    this.reconnectAttempts++
    console.log(`WebSocket将在${this.reconnectDelay}ms后进行第${this.reconnectAttempts}次重连`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect(token)
    }, this.reconnectDelay)
  }

  /**
   * 清除重连定时器
   */
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * 开始心跳
   */
  startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'PING' })
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 处理接收到的消息
   */
  handleMessage(data) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error('消息处理器执行失败:', error)
      }
    })
  }

  /**
   * 注册消息处理器
   * @param {Function} handler - 消息处理函数
   */
  onMessage(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler)
    }
  }

  /**
   * 移除消息处理器
   * @param {Function} handler - 消息处理函数
   */
  offMessage(handler) {
    const index = this.messageHandlers.indexOf(handler)
    if (index > -1) {
      this.messageHandlers.splice(index, 1)
    }
  }

  /**
   * 发送消息
   * @param {object} data - 要发送的数据
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.error('WebSocket未连接，无法发送消息')
    }
  }

  /**
   * 关闭连接
   */
  close() {
    this.isManualClose = true
    this.clearReconnectTimer()
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 获取连接状态
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// 导出单例
export default new WebSocketManager()
