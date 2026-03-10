import { createOpenAIClient, AI_CONFIG } from "./config"
import { db } from "@/lib/db"

// 图像生成请求
export interface ImageGenerationRequest {
  prompt: string
  userId?: string
  model?: string
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
  style?: "vivid" | "natural"
  n?: number
}

// 图像生成响应
export interface ImageGenerationResponse {
  images: {
    url: string
    revisedPrompt: string
  }[]
  cost: number
}

/**
 * 生成图像
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const openai = createOpenAIClient()
  const model = request.model || AI_CONFIG.models.image
  const size = request.size || "1024x1024"
  const quality = request.quality || "standard"
  const style = request.style || "vivid"
  const n = request.n || 1

  try {
    // 验证用户积分
    if (request.userId) {
      const user = await db.user.findUnique({
        where: { id: request.userId },
        select: { credits: true },
      })

      if (!user || user.credits < 2) { // 假设每张图片消耗2积分
        throw new Error("积分不足，请充值")
      }
    }

    const response = await openai.images.generate({
      model,
      prompt: request.prompt,
      size,
      quality,
      style,
      n,
      response_format: "url",
    })

    const images = (response.data || []).map(img => ({
      url: img.url!,
      revisedPrompt: img.revised_prompt || request.prompt,
    }))

    // 扣除积分并保存记录
    if (request.userId) {
      await db.$transaction(async (tx: any) => {
        // 扣除积分
        await tx.user.update({
          where: { id: request.userId },
          data: {
            credits: {
              decrement: images.length * 2, // 每张图片2积分
            },
          },
        })

        // 保存生成记录
        for (const image of images) {
          await tx.generatedImage.create({
            data: {
              userId: request.userId!,
              prompt: request.prompt,
              imageUrl: image.url,
              model,
              size,
              cost: 2,
            },
          })
        }
      })
    }

    const pricing = AI_CONFIG.pricing as any
    return {
      images,
      cost: images.length * (pricing[model] || 0),
    }
  } catch (error: any) {
    console.error("Image generation failed:", error)
    
    if (error?.message?.includes("safety")) {
      throw new Error("生成内容包含安全限制，请修改提示词")
    }
    
    if (error?.message?.includes("credits")) {
      throw error
    }
    
    throw new Error("图像生成失败，请稍后重试")
  }
}

/**
 * 获取用户生成的图像历史
 */
export async function getUserImageHistory(userId: string, limit: number = 20) {
  const images = await db.generatedImage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return images
}

/**
 * 删除生成的图像
 */
export async function deleteGeneratedImage(imageId: string, userId: string) {
  const image = await db.generatedImage.findFirst({
    where: { id: imageId, userId },
  })

  if (!image) {
    throw new Error("图像不存在或没有权限")
  }

  await db.generatedImage.delete({
    where: { id: imageId },
  })

  return true
}

/**
 * 验证提示词安全性
 */
export function validatePromptSafety(prompt: string): { valid: boolean; reason?: string } {
  const lowerPrompt = prompt.toLowerCase()
  
  // 禁止的内容
  const forbiddenPatterns = [
    /nude|naked|explicit/,
    /violence|gore|blood/,
    /hate speech|racist|sexist/,
    /illegal|drugs|weapon/,
    /copyright|trademark/,
  ]

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(lowerPrompt)) {
      return {
        valid: false,
        reason: "提示词包含禁止内容，请修改后重试",
      }
    }
  }

  // 检查长度
  if (prompt.length > 1000) {
    return {
      valid: false,
      reason: "提示词过长，请控制在1000字符以内",
    }
  }

  // 检查是否为空或过短
  if (prompt.trim().length < 3) {
    return {
      valid: false,
      reason: "提示词过短，请提供更详细的描述",
    }
  }

  return { valid: true }
}
