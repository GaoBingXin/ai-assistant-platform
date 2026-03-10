import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "@/lib/ai/image"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

// 简单的提示词安全检查
function validatePromptSafety(prompt: string): boolean {
  const unsafePatterns = [
    /暴力|血腥|残忍/i,
    /色情|裸露|性爱/i,
    /仇恨|歧视|种族主义/i,
    /恐怖主义|极端主义/i,
    /非法活动|犯罪/i,
  ]

  for (const pattern of unsafePatterns) {
    if (pattern.test(prompt)) {
      return false
    }
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, size = "1024x1024" } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "请输入图像描述" }, { status: 400 })
    }

    // 验证提示词安全性
    if (!validatePromptSafety(prompt)) {
      return NextResponse.json({ error: "提示词包含不安全内容" }, { status: 400 })
    }

    // 验证尺寸
    const validSizes = ["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"]
    if (!validSizes.includes(size)) {
      return NextResponse.json({ error: "不支持的图像尺寸" }, { status: 400 })
    }

    // 生成图像
    const result = await generateImage({
      prompt,
      size,
      userId: user.id,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Image generation API error:", error)
    return NextResponse.json(
      { error: error.message || "图像生成失败" },
      { status: 500 }
    )
  }
}
