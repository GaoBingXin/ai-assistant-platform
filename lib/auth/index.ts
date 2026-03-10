// 简化版认证（无数据库）
export async function getCurrentUser() {
  // 开发模式：返回模拟用户
  return {
    id: "demo-user-id",
    email: "demo@example.com",
    name: "Demo User",
    credits: 100,
  }
}
