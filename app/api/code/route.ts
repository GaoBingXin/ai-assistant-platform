import { NextRequest, NextResponse } from "next/server"
import { generateCode } from "@/lib/ai/code"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, language = "javascript", framework } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "请输入代码描述" }, { status: 400 })
    }

    // 使用演示用户ID
    const userId = "demo-user-id"

    // 生成代码
    const result = await generateCode({
      prompt,
      language,
      framework,
      userId,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Code generation API error:", error)
    return NextResponse.json(
      { error: error.message || "代码生成失败" },
      { status: 500 }
    )
  }
}
