// 内存数据库模拟 - 完整修复版本

const mockData = {
  users: new Map(),
  conversations: new Map(),
  messages: new Map(),
  images: new Map(),
}

// 初始化演示用户
mockData.users.set("demo-user-id", {
  id: "demo-user-id",
  email: "demo@example.com",
  name: "Demo User",
  credits: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
})

// 通用查找函数
const findUnique = (collection: Map<any, any>, where: any) => {
  const key = Object.values(where)[0]
  return collection.get(key) || null
}

const findFirst = (collection: Map<any, any>, where: any) => {
  for (const [key, value] of collection.entries()) {
    let match = true
    for (const [field, condition] of Object.entries(where)) {
      if (value[field] !== condition) {
        match = false
        break
      }
    }
    if (match) return value
  }
  return null
}

const create = (collection: Map<any, any>, data: any) => {
  const id = data.id || `${collection.size + 1}-${Date.now()}`
  const item = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  collection.set(id, item)
  return item
}

const update = (collection: Map<any, any>, where: any, data: any) => {
  const key = Object.values(where)[0]
  const item = collection.get(key)
  if (item) {
    const updated = { ...item, ...data, updatedAt: new Date() }
    collection.set(key, updated)
    return updated
  }
  return null
}

const count = (collection: Map<any, any>) => collection.size

// 数据库接口
export const db = {
  user: {
    findUnique: ({ where }: { where: { id: string } }) => Promise.resolve(findUnique(mockData.users, where)),
    findFirst: ({ where }: { where: any }) => Promise.resolve(findFirst(mockData.users, where)),
    update: ({ where, data }: { where: { id: string }, data: any }) => Promise.resolve(update(mockData.users, where, data)),
    create: ({ data }: { data: any }) => Promise.resolve(create(mockData.users, data)),
    count: () => Promise.resolve(count(mockData.users)),
  },
  conversation: {
    findUnique: ({ where }: { where: { id: string } }) => Promise.resolve(findUnique(mockData.conversations, where)),
    findFirst: ({ where }: { where: any }) => Promise.resolve(findFirst(mockData.conversations, where)),
    create: ({ data }: { data: any }) => Promise.resolve(create(mockData.conversations, data)),
    delete: ({ where }: { where: { id: string } }) => {
      const key = Object.values(where)[0]
      mockData.conversations.delete(key)
      return Promise.resolve({ id: key })
    },
    findMany: ({ where, orderBy, take, include }: any = {}) => {
      let results = Array.from(mockData.conversations.values())
      
      // 过滤
      if (where) {
        results = results.filter(item => {
          for (const [key, value] of Object.entries(where)) {
            if (item[key] !== value) return false
          }
          return true
        })
      }
      
      // 排序
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results.sort((a, b) => {
          if (direction === 'desc') {
            return b[field] > a[field] ? 1 : -1
          }
          return a[field] > b[field] ? 1 : -1
        })
      }
      
      // 限制数量
      if (take) {
        results = results.slice(0, take)
      }
      
      // 包含关联数据
      if (include?.messages) {
        results = results.map(conv => ({
          ...conv,
          messages: Array.from(mockData.messages.values())
            .filter(msg => msg.conversationId === conv.id)
            .sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
            .slice(0, include.messages.take || 50)
        }))
      }
      
      return Promise.resolve(results)
    },
    count: () => Promise.resolve(count(mockData.conversations)),
  },
  message: {
    create: ({ data }: { data: any }) => Promise.resolve(create(mockData.messages, data)),
    findMany: ({ where, orderBy }: any = {}) => {
      let results = Array.from(mockData.messages.values())
      
      if (where) {
        results = results.filter(item => {
          for (const [key, value] of Object.entries(where)) {
            if (item[key] !== value) return false
          }
          return true
        })
      }
      
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results.sort((a, b) => {
          if (direction === 'desc') {
            return b[field] > a[field] ? 1 : -1
          }
          return a[field] > b[field] ? 1 : -1
        })
      }
      
      return Promise.resolve(results)
    },
    count: () => Promise.resolve(count(mockData.messages)),
  },
  generatedImage: {
    create: ({ data }: { data: any }) => Promise.resolve(create(mockData.images, data)),
    count: () => Promise.resolve(count(mockData.images)),
  },
}

export async function initDatabase() {
  console.log("✅ 内存数据库初始化完成")
  return true
}

export async function getStats() {
  return {
    userCount: mockData.users.size,
    conversationCount: mockData.conversations.size,
    messageCount: mockData.messages.size,
    imageCount: mockData.images.size,
  }
}
