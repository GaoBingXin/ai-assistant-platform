import { createOpenAIClient } from "./config"
import { db } from "@/lib/db"

export interface ChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM"
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  conversationId?: string
  userId: string
  stream?: boolean
}

export interface ChatResponse {
  content: string
  conversationId: string
  messageId: string
}

export async function handleChatRequest(
  request: ChatRequest,
  onChunk?: (chunk: string) => void
): Promise<ChatResponse> {
  const { messages, conversationId, userId, stream = false } = request

  try {
    // 创建或获取对话
    let conversation
    if (conversationId) {
      // 先查找对话
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      })
      // 验证对话属于当前用户
      if (conversation && conversation.userId !== userId) {
        throw new Error("没有权限访问此对话")
      }
    }

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          title: messages[0]?.content?.substring(0, 50) || "新对话",
          userId,
        },
      })
    }

    // 保存用户消息
    const userMessage = messages[messages.length - 1]
    await db.message.create({
      data: {
        content: userMessage.content,
        role: userMessage.role,
        conversationId: conversation.id,
      },
    })

    // 调用AI API
    const openai = createOpenAIClient()
    
    const formattedMessages = messages.map(msg => ({
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
    }))

    if (stream && onChunk) {
      // 流式响应
      const streamResponse = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: formattedMessages,
        stream: true,
      })

      let fullResponse = ""
      for await (const chunk of streamResponse) {
        const content = chunk.choices[0]?.delta?.content || ""
        if (content) {
          fullResponse += content
          onChunk(content)
        }
      }

      // 保存助手回复
      const assistantMessage = await db.message.create({
        data: {
          content: fullResponse,
          role: "ASSISTANT",
          conversationId: conversation.id,
        },
      })

      return {
        content: fullResponse,
        conversationId: conversation.id,
        messageId: assistantMessage.id,
      }
    } else {
      // 非流式响应
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: formattedMessages,
        stream: false,
      })

      const responseContent = completion.choices[0]?.message?.content || ""

      // 保存助手回复
      const assistantMessage = await db.message.create({
        data: {
          content: responseContent,
          role: "ASSISTANT",
          conversationId: conversation.id,
        },
      })

      return {
        content: responseContent,
        conversationId: conversation.id,
        messageId: assistantMessage.id,
      }
    }
  } catch (error: any) {
    console.error("Chat error:", error)
    throw new Error(error.message || "AI聊天失败")
  }
}
