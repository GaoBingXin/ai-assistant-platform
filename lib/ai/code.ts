import { createOpenAIClient } from "./config"

export interface CodeGenerationRequest {
  prompt: string
  language?: string
  framework?: string
  userId: string
}

export interface CodeGenerationResponse {
  code: string
  language: string
  explanation?: string
}

export async function generateCode(
  request: CodeGenerationRequest
): Promise<CodeGenerationResponse> {
  const { prompt, language = "javascript", framework, userId } = request

  try {
    const openai = createOpenAIClient()

    // 构建系统提示
    const systemPrompt = `你是一个专业的${language}程序员${
      framework ? `，专门使用${framework}框架` : ""
    }。请根据用户需求生成高质量、可运行的代码。代码应该：
    1. 有良好的注释
    2. 遵循最佳实践
    3. 包含必要的导入/依赖
    4. 如果有错误处理
    5. 如果有示例用法`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const code = completion.choices[0]?.message?.content || ""

    // 提取代码和解释
    let cleanedCode = code
    let explanation = ""

    // 尝试分离解释和代码（简化版，不使用s标志）
    const explanationMatch = code.match(/解释[：:]\s*(.*?)(?:\n```|\n$)/)
    if (explanationMatch) {
      explanation = explanationMatch[1].trim()
      cleanedCode = code.replace(explanationMatch[0], "").trim()
    }

    // 移除代码块标记
    cleanedCode = cleanedCode.replace(/```[\w]*\n?/g, "").replace(/```$/g, "").trim()

    return {
      code: cleanedCode,
      language,
      explanation,
    }
  } catch (error: any) {
    console.error("Code generation error:", error)
    throw new Error(error.message || "代码生成失败")
  }
}
