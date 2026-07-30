import { Response } from 'express';
import OpenAI from 'openai';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const apiKey = process.env.NVIDIA_NIM_API_KEY;
const baseURL = process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';

export const handleAiProxy = async (req: AuthenticatedRequest, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required.' });
  }

  if (!apiKey) {
    return res.json(generateLocalMockAiResponse(prompt));
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey, timeout: 10000 });
    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return res.json(generateLocalMockAiResponse(prompt));
    }

    try {
      const parsed = JSON.parse(content);
      return res.json(parsed);
    } catch {
      return res.json(generateLocalMockAiResponse(prompt));
    }
  } catch (error) {
    return res.json(generateLocalMockAiResponse(prompt));
  }
};

function generateLocalMockAiResponse(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes('laptop') || lower.includes('computer')) {
    return {
      intent: 'product_search',
      requiresApiCall: true,
      apiAction: 'search_products',
      reply: 'Here are the top-rated laptops currently available in our catalog.',
      filters: { category: 'laptops' },
    };
  }

  return {
    intent: 'general_chat',
    requiresApiCall: false,
    apiAction: 'none',
    reply: "I am ShoPilot AI! How can I assist with your shopping today?",
    filters: {},
  };
}
