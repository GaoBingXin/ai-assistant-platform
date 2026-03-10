// 简化版内存数据库模拟 - 避免Map迭代器问题

const data = {
  users: [{
    id: "demo-user-id",
    email: "demo@example.com",
    name: "Demo User",
    credits: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  }],
  conversations: [] as any[],
  messages: [] as any[],
  images: [] as any[],
}

// 简单查找函数
const findUnique = (collection: any[], where: any) => {
  const key = Object.keys(where)[0]
  const value = where[key]
  return collection.find(item => item[key] === value) || null
}

const findFirst = (collection: any[], where: any) => {
  return collection.find(item => {
    for (const [key, val] of Object.entries(where)) {
      if (item[key] !== val) return false
    }
    return true
  }) || null
}

const create = (collection: any[], item: any) => {
  const newItem = {
    ...item,
    id: `${collection.length + 1}-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  collection.push(newItem)
  return newItem
}

// 数据库接口
export const db = {
  user: {
    findUnique: ({ where }: { where: { id: string } }) => 
      Promise.resolve(findUnique(data.users, where)),
    findFirst: ({ where }: { where: any }) => 
      Promise.resolve(findFirst(data.users, where)),
    update: ({ where, data: updateData }: { where: { id: string }, data: any }) => {
      const user = findUnique(data.users, where)
      if (user) {
        Object.assign(user, updateData, { updatedAt: new Date() })
      }
      return Promise.resolve(user)
    },
    count: () => Promise.resolve(data.users.length),
  },
  conversation: {
    findUnique: ({ where }: { where: { id: string } }) => 
      Promise.resolve(findUnique(data.conversations, where)),
    findFirst: ({ where }: { where: any }) => 
      Promise.resolve(findFirst(data.conversations, where)),
    create: ({ data: itemData }: { data: any }) => 
      Promise.resolve(create(data.conversations, itemData)),
    delete: ({ where }: { where: { id: string } }) => {
      const index = data.conversations.findIndex(c => c.id === where.id)
      if (index > -1) {
        data.conversations.splice(index, 1)
      }
      return Promise.resolve({ id: where.id })
    },
    findMany: ({ where, orderBy, take, include }: any = {}) => {
      let results = [...data.conversations]
      
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
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      
      if (take) {
        results = results.slice(0, take)
      }
      
      if (include?.messages) {
        results = results.map(conv => ({
          ...conv,
          messages: data.messages
            .filter(msg => msg.conversationId === conv.id)
            .sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1)
            .slice(0, include.messages.take || 50)
        }))
      }
      
      return Promise.resolve(results)
    },
    count: () => Promise.resolve(data.conversations.length),
  },
  message: {
    create: ({ data: itemData }: { data: any }) => 
      Promise.resolve(create(data.messages, itemData)),
    findMany: ({ where, orderBy }: any = {}) => {
      let results = [...data.messages]
      
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
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      
      return Promise.resolve(results)
    },
  },
  generatedImage: {
    create: ({ data: itemData }: { data: any }) => 
      Promise.resolve(create(data.images, itemData)),
  },
}

export async function initDatabase() {
  console.log("✅ 内存数据库初始化完成")
  return true
}
