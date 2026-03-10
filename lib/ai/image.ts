import { db } from "@/lib/db"

export interface ImageGenerationRequest {
  prompt: string
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
  userId: string
}

export interface ImageGenerationResponse {
  url: string
  size: string
  prompt: string
  imageId: string
}

export async function generateImage(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
  const { prompt, size = "1024x1024", userId } = request

  // 检查用户积分
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("用户不存在")
  }

  if (user.credits < 1) {
    throw new Error("积分不足，请充值")
  }

  try {
    // DeepSeek不支持图像生成，返回占位图像
    const imageUrl = `https://placehold.co/${size.replace('x', '/')}/cccccc/000000?text=${encodeURIComponent(prompt.substring(0, 20))}`
    
    // 扣除积分
    await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: 1,
        },
      },
    })

    // 保存图像记录
    const imageRecord = await db.generatedImage.create({
      data: {
        prompt,
        imageUrl,
        size,
        userId,
      },
    })

    return {
      url: imageUrl,
      size,
      prompt,
      imageId: imageRecord.id,
    }
  } catch (error: any) {
    console.error("Image generation error:", error)
    throw new Error("DeepSeek暂不支持图像生成，如需图像生成请配置OpenAI API")
  }
}
