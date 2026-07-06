import OpenAI from 'openai';

export interface NvidiaAIParams {
  model?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export const callNvidiaAI = async (params: NvidiaAIParams): Promise<any> => {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_NIM_API_KEY is not defined in the environment variables.');
  }

  const client = new OpenAI({
    baseURL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    apiKey: apiKey,
  });

  const modelName = params.model || 'meta/llama-3.3-70b-instruct';

  try {
    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: params.prompt,
        },
      ],
      temperature: params.temperature ?? 0.2, // Lower temperature makes JSON structure extraction more stable
      max_tokens: params.maxTokens ?? 2048,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty AI response');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('NVIDIA AI Client Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI request failed',
      data: null,
    };
  }
};
