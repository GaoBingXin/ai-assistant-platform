import { NextRequest, NextResponse } from "next/server"
import { generateImage, validatePromptSafety, ImageGenerationRequest } from "@/lib/ai/image"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, size, quality, style, n = 1 } = body

    // 验证必填字段
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    // 验证提示词安全性
    const safetyCheck = validatePromptSafety(prompt)
    if (!safetyCheck.valid) {
      return NextResponse.json({ error: safetyCheck.reason }, { status: 400 })
    }

    // 构建请求
    const imageRequest: ImageGenerationRequest = {
      prompt,
      userId: user.id,
      size,
      quality,
      style,
      n: Math.min(n, 4), // 限制最多4张
    }

    // 生成图像
    const response = await generateImage(imageRequest)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Image generation error:", error)
    
    if (error.message.includes("积分不足") || error.message.includes("安全限制")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "图像生成失败，请稍后重试" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    // 获取用户的图像历史
    const images = await db.generatedImage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Get image history error:", error)
    return NextResponse.json(
      { error: "获取图像历史失败" },
      { status: 500 }
    )
  }
}
