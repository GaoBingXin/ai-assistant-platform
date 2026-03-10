import { NextRequest, NextResponse } from "next/server"
import { generateCode, validateLanguage, validateFramework } from "@/lib/ai/code"
import { getCodeExamples } from "@/lib/ai/code-examples"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, language, framework, context } = body

    // 验证必填字段
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "需求描述不能为空" }, { status: 400 })
    }

    // 验证语言和框架
    if (language && !validateLanguage(language)) {
      return NextResponse.json({ error: "不支持该编程语言" }, { status: 400 })
    }

    if (framework && !validateFramework(framework)) {
      return NextResponse.json({ error: "不支持该框架" }, { status: 400 })
    }

    // 构建请求
    const codeRequest = {
      prompt,
      userId: user.id,
      language,
      framework,
      context,
    }

    // 生成代码
    const response = await generateCode(codeRequest)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Code generation error:", error)
    return NextResponse.json(
      { error: error.message || "代码生成失败" },
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
    const language = searchParams.get("language")
    const category = searchParams.get("category") || "basic"
    const limit = parseInt(searchParams.get("limit") || "5")

    // 验证语言
    if (!language || !validateLanguage(language)) {
      return NextResponse.json({ error: "无效的编程语言" }, { status: 400 })
    }

    // 获取代码示例
    const examples = await getCodeExamples(language, category, limit)
    return NextResponse.json({ examples })
  } catch (error: any) {
    console.error("Get code examples error:", error)
    return NextResponse.json(
      { error: "获取代码示例失败" },
      { status: 500 }
    )
  }
}
