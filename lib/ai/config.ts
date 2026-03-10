// AI配置 - 使用DeepSeek API

export interface AIModelConfig {
  name: string
  provider: 'deepseek' | 'openai'
  maxTokens: number
  costPer1KTokens: number
  description: string
}

export interface AIConfig {
  // DeepSeek配置
  deepseek: {
    apiKey?: string
    baseURL?: string
  }
  
  // 模型配置
  models: {
    chat: AIModelConfig[]
    image: AIModelConfig[]
    code: AIModelConfig[]
  }
  
  // 默认模型
  defaults: {
    chatModel: string
    imageModel: string
    codeModel: string
  }
}

// 从环境变量获取配置
export function getAIConfig(): AIConfig {
  const config: AIConfig = {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    },
    models: {
      chat: [
        {
          name: 'deepseek-chat',
          provider: 'deepseek',
          maxTokens: 4096,
          costPer1KTokens: 0.001,
          description: 'DeepSeek对话模型',
        },
      ],
      image: [
        {
          name: 'dall-e-3',
          provider: 'openai',
          maxTokens: 0,
          costPer1KTokens: 0.08,
          description: 'OpenAI DALL-E 3图像生成（需要OpenAI API）',
        },
      ],
      code: [
        {
          name: 'deepseek-coder',
          provider: 'deepseek',
          maxTokens: 4096,
          costPer1KTokens: 0.001,
          description: 'DeepSeek代码生成模型',
        },
      ],
    },
    defaults: {
      chatModel: 'deepseek-chat',
      imageModel: 'deepseek-chat', // DeepSeek不支持图像，用聊天模型代替
      codeModel: 'deepseek-coder',
    },
  }
  
  return config
}

// 创建AI客户端
export function createOpenAIClient() {
  const { OpenAI } = require('openai')
  const config = getAIConfig()
  
  // 使用DeepSeek配置
  return new OpenAI({
    apiKey: config.deepseek.apiKey,
    baseURL: config.deepseek.baseURL,
  })
}

// 获取AI客户端（兼容旧代码）
export const getAIClient = createOpenAIClient

// 计算成本
export function calculateCost(model: string, tokens: number): number {
  const config = getAIConfig()
  const allModels = [...config.models.chat, ...config.models.image, ...config.models.code]
  const modelConfig = allModels.find(m => m.name === model)
  
  if (!modelConfig) return 0
  return (tokens / 1000) * modelConfig.costPer1KTokens
}
