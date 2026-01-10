import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockContacts } from '@/mock/data'

export const useContactStore = defineStore('contact', () => {
  // 联系人列表
  const contacts = ref([])
  // 搜索关键词
  const searchKeyword = ref('')
  // 当前选中的联系人
  const currentContact = ref(null)

  // 按首字母分组的联系人
  const groupedContacts = computed(() => {
    const groups = {}
    const filtered = searchKeyword.value
      ? contacts.value.filter(c => 
          c.nickname.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          c.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
      : contacts.value

    filtered.forEach(contact => {
      const firstLetter = contact.nickname.charAt(0).toUpperCase()
      const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#'
      if (!groups[letter]) {
        groups[letter] = []
      }
      groups[letter].push(contact)
    })

    // 按字母排序
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === '#') return 1
      if (b === '#') return -1
      return a.localeCompare(b)
    })

    return sortedKeys.map(key => ({
      letter: key,
      contacts: groups[key]
    }))
  })

  // 在线联系人数量
  const onlineCount = computed(() => {
    return contacts.value.filter(c => c.status === 'online').length
  })

  // 加载联系人
  const loadContacts = () => {
    // 后续替换为真实API
    contacts.value = mockContacts
  }

  // 搜索联系人
  const setSearchKeyword = (keyword) => {
    searchKeyword.value = keyword
  }

  // 选中联系人
  const selectContact = (contact) => {
    currentContact.value = contact
  }

  // 添加联系人
  const addContact = (contact) => {
    contacts.value.push(contact)
  }

  // 删除联系人
  const removeContact = (contactId) => {
    const index = contacts.value.findIndex(c => c.id === contactId)
    if (index > -1) {
      contacts.value.splice(index, 1)
    }
  }

  return {
    contacts,
    searchKeyword,
    currentContact,
    groupedContacts,
    onlineCount,
    loadContacts,
    setSearchKeyword,
    selectContact,
    addContact,
    removeContact
  }
})
