import OpenAI from 'openai';

export interface NvidiaAIParams {
  model?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  let lastError: Error | null = null;

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

      const parsed = cleanAndParseJson(content);
      console.log(`[Nvidia Client] Success with model: ${modelName}`);
      return parsed;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[Nvidia Client] Model ${modelName} failed or timed out. Error:`, msg);
      lastError = error instanceof Error ? error : new Error(msg);
    }
  }

  console.error('[Nvidia Client] All fallback models failed.');
  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : 'All models failed or timed out',
    data: null,
  };
};

/**
 * Clean potential markdown wrappers and extract/parse valid JSON from the AI response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanAndParseJson(content: string): any {
  let cleaned = content.trim();

  // Strip markdown code block wrappers if they exist
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/, '');
  cleaned = cleaned.trim();

  // Extract the main JSON object if the LLM output includes leading or trailing text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

