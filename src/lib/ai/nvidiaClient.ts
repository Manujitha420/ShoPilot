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
    timeout: 10000, // Timeout requests after 10 seconds to prevent hanging
  });

  // Fallback chain for resilience
  const modelsToTry = [
    params.model || 'meta/llama-3.3-70b-instruct',
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-8b-instruct',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Nvidia Client] Attempting completion using model: ${modelName}`);
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

      const parsed = JSON.parse(content);
      console.log(`[Nvidia Client] Success with model: ${modelName}`);
      return parsed;
    } catch (error: any) {
      console.warn(`[Nvidia Client] Model ${modelName} failed or timed out. Error:`, error.message || error);
      lastError = error;
    }
  }

  console.error('[Nvidia Client] All fallback models failed.');
  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : 'All models failed or timed out',
    data: null,
  };
};
