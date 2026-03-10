import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(date: Date | string | number, format: "short" | "long" = "short") {
  const d = new Date(date)
  if (format === "short") {
    return d.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// 生成随机ID
export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`
}

// 截断文本
export function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

// 延迟函数
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 安全获取嵌套对象属性
export function get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split(".")
  let result = obj
  for (const key of keys) {
    result = result?.[key]
    if (result === undefined) return defaultValue
  }
  return result ?? defaultValue
}
