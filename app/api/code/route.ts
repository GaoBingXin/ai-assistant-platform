import { NextRequest, NextResponse } from "next/server"
import { generateCode } from "@/lib/ai/code"
import { getCodeExamples } from "@/lib/ai/code-examples"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, language = "javascript", framework } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "请输入代码描述" }, { status: 400 })
    }

    // 验证语言
    const validLanguages = ["javascript", "typescript", "python", "java", "go", "rust", "c++", "c#"]
    if (!validLanguages.includes(language.toLowerCase())) {
      return NextResponse.json({ error: "不支持的语言" }, { status: 400 })
    }

    // 生成代码
    const result = await generateCode({
      prompt,
      language,
      framework,
      userId: user.id,
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

export async function GET(request: NextRequest) {
  try {
    // 获取代码示例
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "javascript"
    const framework = searchParams.get("framework") || undefined

    const examples = getCodeExamples(language, framework)
    return NextResponse.json({ examples })
  } catch (error) {
    console.error("Get code examples error:", error)
    return NextResponse.json(
      { error: "获取代码示例失败" },
      { status: 500 }
    )
  }
}
