import OpenAI from "openai"

// AI服务配置
export const AI_CONFIG = {
  // OpenAI API配置
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    organization: process.env.OPENAI_ORG_ID,
  },
  
  // 模型配置
  models: {
    chat: "gpt-4-turbo-preview", // 或 "gpt-3.5-turbo"
    image: "dall-e-3",
    code: "gpt-4-turbo-preview",
  },
  
  // 默认参数
  defaults: {
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },
  
  // 成本控制（单位：美元/千token）
  pricing: {
    "gpt-4-turbo-preview": 0.01, // 输入
    "gpt-4-turbo-preview-output": 0.03, // 输出
    "gpt-3.5-turbo": 0.001, // 输入
    "gpt-3.5-turbo-output": 0.002, // 输出
    "dall-e-3": 0.04, // 每张图片
  },
} as const

// 初始化OpenAI客户端
export function createOpenAIClient() {
  if (!AI_CONFIG.openai.apiKey) {
    throw new Error("OPENAI_API_KEY is not set")
  }
  
  return new OpenAI({
    apiKey: AI_CONFIG.openai.apiKey,
    organization: AI_CONFIG.openai.organization,
  })
}

// 计算成本
export function calculateCost(model: string, inputTokens: number, outputTokens: number = 0): number {
  const pricing = AI_CONFIG.pricing as Record<string, number>
  
  if (!pricing[model]) {
    return 0
  }
  
  // 如果是图片生成
  if (model === "dall-e-3") {
    return pricing[model]
  }
  
  // 计算文本生成成本
  const inputCost = (inputTokens / 1000) * pricing[model]
  const outputModel = `${model}-output`
  const outputCost = outputTokens > 0 && pricing[outputModel] 
    ? (outputTokens / 1000) * pricing[outputModel]
    : 0
  
  return inputCost + outputCost
}
