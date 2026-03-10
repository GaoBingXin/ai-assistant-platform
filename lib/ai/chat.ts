import { createOpenAIClient, AI_CONFIG } from "./config"
import { db } from "@/lib/db"

// 聊天消息接口
export interface ChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM"
  content: string
}

// 聊天请求参数
export interface ChatRequest {
  messages: ChatMessage[]
  conversationId?: string
  userId?: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// 聊天响应
export interface ChatResponse {
  content: string
  conversationId?: string
  messageId?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 流式响应处理器
export type StreamHandler = (chunk: string) => void

/**
 * 处理AI聊天请求
 */
export async function handleChatRequest(
  request: ChatRequest,
  onStream?: StreamHandler
): Promise<ChatResponse> {
  const openai = createOpenAIClient()
  const model = request.model || AI_CONFIG.models.chat
  const temperature = request.temperature ?? AI_CONFIG.defaults.temperature
  const maxTokens = request.maxTokens ?? AI_CONFIG.defaults.maxTokens

  try {
    // 转换消息格式
    const messages = request.messages.map(msg => ({
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
    }))

    // 创建或更新对话
    let conversationId = request.conversationId
    if (request.userId && !conversationId) {
      const conversation = await db.conversation.create({
        data: {
          userId: request.userId,
          title: messages[0]?.content?.substring(0, 50) || "新对话",
        },
      })
      conversationId = conversation.id
    }

    // 保存用户消息
    let messageId: string | undefined
    if (conversationId && request.userId) {
      const lastMessage = request.messages[request.messages.length - 1]
      if (lastMessage?.role === "USER") {
        const message = await db.message.create({
          data: {
            conversationId,
            userId: request.userId,
            role: lastMessage.role,
            content: lastMessage.content,
          },
        })
        messageId = message.id
      }
    }

    // 流式响应
    if (request.stream && onStream) {
      const stream = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })

      let fullResponse = ""
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ""
        fullResponse += content
        onStream(content)
      }

      // 保存AI回复
      if (conversationId && request.userId && fullResponse) {
        await db.message.create({
          data: {
            conversationId,
            role: "ASSISTANT",
            content: fullResponse,
          },
        })
      }

      return {
        content: fullResponse,
        conversationId,
        messageId,
      }
    }

    // 非流式响应
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const content = completion.choices[0]?.message?.content || ""
    
    // 保存AI回复
    if (conversationId && request.userId && content) {
      await db.message.create({
        data: {
          conversationId,
          role: "ASSISTANT",
          content,
        },
      })
    }

    return {
      content,
      conversationId,
      messageId,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    }
  } catch (error) {
    console.error("Chat request failed:", error)
    throw new Error("AI服务暂时不可用，请稍后重试")
  }
}

/**
 * 获取用户对话历史
 */
export async function getConversationHistory(
  userId: string,
  limit: number = 20,
  conversationId?: string
) {
  const where = conversationId 
    ? { id: conversationId, userId }
    : { userId }

  const conversations = await db.conversation.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 50,
      },
    },
  })

  return conversations
}

/**
 * 删除对话
 */
export async function deleteConversation(conversationId: string, userId: string) {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId, userId },
  })

  if (!conversation) {
    throw new Error("对话不存在或没有权限")
  }

  await db.conversation.delete({
    where: { id: conversationId },
  })

  return true
}

/**
 * 生成对话标题
 */
export async function generateConversationTitle(messages: ChatMessage[]): Promise<string> {
  if (messages.length === 0) return "新对话"
  
  const firstMessage = messages[0]?.content || ""
  if (firstMessage.length > 50) {
    return firstMessage.substring(0, 47) + "..."
  }
  return firstMessage || "新对话"
}
