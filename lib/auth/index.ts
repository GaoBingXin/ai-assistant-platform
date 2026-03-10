import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// 获取当前用户的辅助函数
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

// 检查用户是否已登录
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("未登录")
  }
  return user
}
