// 内存数据库模拟
export const db = {
  user: {
    findUnique: async () => ({
      id: "demo-user-id",
      credits: 100,
    }),
    update: async () => ({}),
  },
  conversation: {
    findUnique: async () => null,
    create: async () => ({ id: "conv-001" }),
  },
  message: {
    create: async () => ({ id: "msg-001" }),
  },
  generatedImage: {
    create: async () => ({ id: "img-001" }),
  },
}

export async function initDatabase() {
  console.log("✅ 使用内存数据库")
  return true
}
