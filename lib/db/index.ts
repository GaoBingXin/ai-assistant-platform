import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

// 数据库连接健康检查
export async function checkDatabaseHealth() {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

// 事务辅助函数
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = db as any
  return prisma.$transaction(callback)
}
