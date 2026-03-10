import { createOpenAIClient, AI_CONFIG } from "./config"
import { db } from "@/lib/db"

// 代码生成请求
export interface CodeGenerationRequest {
  prompt: string
  userId?: string
  language?: string
  framework?: string
  context?: string
  model?: string
  temperature?: number
}

// 代码生成响应
export interface CodeGenerationResponse {
  code: string
  explanation?: string
  language?: string
  framework?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 支持的编程语言
export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
  "powershell",
] as const

// 支持的框架
export const SUPPORTED_FRAMEWORKS = [
  "react",
  "vue",
  "angular",
  "nextjs",
  "nuxt",
  "express",
  "nestjs",
  "django",
  "flask",
  "spring",
  "laravel",
  "rails",
  "flutter",
  "react-native",
] as const

/**
 * 生成代码
 */
export async function generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
  const openai = createOpenAIClient()
  const model = request.model || AI_CONFIG.models.code
  const temperature = request.temperature ?? 0.2 // 代码生成需要较低的温度以获得更确定的结果

  try {
    // 构建系统提示
    const systemPrompt = buildSystemPrompt(request.language, request.framework)
    
    // 构建用户提示
    const userPrompt = buildUserPrompt(request.prompt, request.context)

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ]

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: AI_CONFIG.defaults.maxTokens,
    })

    const content = completion.choices[0]?.message?.content || ""
    const { code, explanation } = parseCodeResponse(content)

    // 记录使用情况（可选）
    if (request.userId && completion.usage) {
      const cost = completion.usage.total_tokens * 0.001 // 简单成本计算
      
      // 这里可以记录代码生成的使用情况
      // 例如：更新用户积分或记录使用历史
    }

    return {
      code,
      explanation,
      language: request.language,
      framework: request.framework,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    }
  } catch (error) {
    console.error("Code generation failed:", error)
    throw new Error("代码生成失败，请稍后重试")
  }
}

/**
 * 构建系统提示
 */
function buildSystemPrompt(language?: string, framework?: string): string {
  let prompt = "你是一个专业的编程助手，请根据用户需求生成高质量的代码。\n\n"

  if (language) {
    prompt += `使用 ${language} 编程语言。\n`
  }

  if (framework) {
    prompt += `使用 ${framework} 框架。\n`
  }

  prompt += `
要求：
1. 生成完整、可运行的代码
2. 包含必要的注释
3. 遵循最佳实践和代码规范
4. 考虑性能和安全性
5. 如果适用，包含测试代码
6. 在代码后提供简要的解释

请按照以下格式输出：
\`\`\`${language || 'javascript'}
// 你的代码
\`\`\`

解释：你的代码解释
`

  return prompt
}

/**
 * 构建用户提示
 */
function buildUserPrompt(prompt: string, context?: string): string {
  let userPrompt = prompt

  if (context) {
    userPrompt = `上下文：${context}\n\n需求：${prompt}`
  }

  return userPrompt
}

/**
 * 解析代码响应
 */
function parseCodeResponse(content: string): { code: string; explanation?: string } {
  // 提取代码块
  const codeBlockRegex = /```(?:[\w]*)\n([\s\S]*?)```/
  const match = content.match(codeBlockRegex)
  
  if (match) {
    const code = match[1].trim()
    const explanation = content.replace(match[0], '').trim()
    return { code, explanation: explanation || undefined }
  }

  // 如果没有找到代码块，尝试查找第一个代码片段
  const firstCodeStart = content.indexOf('```')
  if (firstCodeStart !== -1) {
    const codeStart = firstCodeStart + 3
    const codeEnd = content.indexOf('```', codeStart)
    if (codeEnd !== -1) {
      const code = content.substring(codeStart, codeEnd).trim()
      const explanation = content.substring(codeEnd + 3).trim()
      return { code, explanation: explanation || undefined }
    }
  }

  // 如果没有代码块，返回整个内容作为代码
  return { code: content.trim() }
}

/**
 * 验证编程语言
 */
export function validateLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.includes(language.toLowerCase() as any)
}

/**
 * 验证框架
 */
export function validateFramework(framework: string): boolean {
  return SUPPORTED_FRAMEWORKS.includes(framework.toLowerCase() as any)
}

/**
 * 获取代码示例
 */
export async function getCodeExamples(
  language: string,
  category: string = "basic",
  limit: number = 5
): Promise<Array<{ title: string; code: string; description: string }>> {
  // 这里可以连接数据库获取预定义的代码示例
  // 暂时返回静态示例
  
  const examples: Record<string, Array<{ title: string; code: string; description: string }>> = {
    javascript: [
      {
        title: "异步函数处理",
        code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
        description: "使用async/await处理异步请求的最佳实践",
      },
    ],
    python: [
      {
        title: "文件操作",
        code: `def read_file(filepath):
    """读取文件内容"""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"文件不存在: {filepath}")
        return None
    except Exception as e:
        print(f"读取文件时出错: {e}")
        return None`,
        description: "Python文件读取的异常处理",
      },
    ],
  }

  return examples[language]?.slice(0, limit) || []
}
