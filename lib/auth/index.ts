// 简化版认证模块
export async function getCurrentUser() {
  // 开发模式：返回模拟用户
  return {
    id: "demo-user-id",
    email: "demo@example.com",
    name: "Demo User",
    credits: 100,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("需要登录")
  }
  return user
}

// 简化版session hook
export function useSession() {
  return {
    data: {
      user: {
        id: "demo-user-id",
        email: "demo@example.com",
        name: "Demo User",
        credits: 100,
      }
    },
    status: "authenticated" as const
  }
}
