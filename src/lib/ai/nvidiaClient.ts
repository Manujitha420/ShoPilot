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
    console.warn('[Nvidia Client] WARNING: NVIDIA_NIM_API_KEY is not defined in the environment. Falling back to local mock AI response engine.');
    return generateLocalMockResponse(params.prompt);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateLocalMockResponse(prompt: string): any {
  // 1. Detect prompt type
  if (prompt.includes('You are an AI Shopping Assistant')) {
    // Chat prompt - Extract last message
    let currentMessage = '';
    const userLines = prompt.split('\n').filter(line => line.trim().startsWith('User:'));
    if (userLines.length > 0) {
      const lastLine = userLines[userLines.length - 1];
      currentMessage = lastLine.replace(/^User:\s*/, '').trim();
    } else {
      currentMessage = 'hello';
    }

    const msgLower = currentMessage.toLowerCase();
    
    // Default response structure
    const response = {
      intent: 'greeting',
      requiresApiCall: false,
      apiAction: 'none',
      needsMoreInformation: false,
      missingInformation: [] as string[],
      filters: {
        category: '',
        brand: '',
        query: '',
        minPrice: null as number | null,
        maxPrice: null as number | null,
        color: '',
        purpose: '',
      },
      reply: '',
    };

    // Greetings
    if (msgLower.match(/\b(hi|hello|hey|greetings|yo)\b/)) {
      response.intent = 'greeting';
      response.reply = "Hello! I'm ShoPilot, your AI-powered shopping assistant. I can help you search for products, compare specs, or recommend items. What are you looking for today?";
      return response;
    }

    // Gratitude / thanks
    if (msgLower.match(/\b(thanks|thank you|great|awesome|perfect|cool)\b/)) {
      response.intent = 'gratitude';
      response.requiresApiCall = true;
      response.apiAction = 'featured_products';
      response.reply = "You're very welcome! If you need anything else, just let me know. In the meantime, here are some featured products you might like:";
      return response;
    }

    // Help / app navigation
    if (msgLower.match(/\b(help|features|how to|what can you do|navigate)\b/)) {
      response.intent = 'app_question';
      response.reply = "I am ShoPilot, an AI shopping assistant. You can use me to: \n1. Search the catalog (e.g., 'find laptops under $1000')\n2. Get recommendations (e.g., 'suggest a smartphone for gaming')\n3. Compare products (use the 'Compare' buttons on product pages)\nHow can I help you?";
      return response;
    }

    // Product search or recommendation
    response.intent = 'product_search';
    response.requiresApiCall = true;
    response.apiAction = 'search_products';

    // Parse category
    if (msgLower.includes('laptop') || msgLower.includes('computer') || msgLower.includes('pc')) {
      response.filters.category = 'laptops';
    } else if (msgLower.includes('phone') || msgLower.includes('smartphone') || msgLower.includes('iphone') || msgLower.includes('samsung')) {
      response.filters.category = 'smartphones';
    } else if (msgLower.includes('perfume') || msgLower.includes('fragrance') || msgLower.includes('cologne') || msgLower.includes('scent')) {
      response.filters.category = 'fragrances';
    } else if (msgLower.includes('skin') || msgLower.includes('cream') || msgLower.includes('skincare') || msgLower.includes('beauty')) {
      response.filters.category = 'skincare';
    } else if (msgLower.includes('grocer') || msgLower.includes('food') || msgLower.includes('snack') || msgLower.includes('drink')) {
      response.filters.category = 'groceries';
    } else if (msgLower.includes('furniture') || msgLower.includes('chair') || msgLower.includes('table') || msgLower.includes('sofa') || msgLower.includes('bed')) {
      response.filters.category = 'furniture';
    } else if (msgLower.includes('decor') || msgLower.includes('lamp') || msgLower.includes('mirror') || msgLower.includes('clock')) {
      response.filters.category = 'home-decoration';
    } else if (msgLower.includes('top') || msgLower.includes('shirt') || msgLower.includes('clothing')) {
      response.filters.category = 'tops';
    } else if (msgLower.includes('dress') || msgLower.includes('skirt')) {
      response.filters.category = 'womens-dresses';
    }

    // Parse brand
    if (msgLower.includes('apple')) {
      response.filters.brand = 'Apple';
    } else if (msgLower.includes('samsung')) {
      response.filters.brand = 'Samsung';
    } else if (msgLower.includes('nike')) {
      response.filters.brand = 'Nike';
    } else if (msgLower.includes('loreal') || msgLower.includes("l'oreal")) {
      response.filters.brand = "L'Oreal";
    }

    // Parse price limits
    const underMatch = msgLower.match(/under\s*\$?\s*(\d+)/) || msgLower.match(/less\s*than\s*\$?\s*(\d+)/) || msgLower.match(/below\s*\$?\s*(\d+)/);
    if (underMatch) {
      response.filters.maxPrice = parseInt(underMatch[1], 10);
    }
    const overMatch = msgLower.match(/over\s*\$?\s*(\d+)/) || msgLower.match(/more\s*than\s*\$?\s*(\d+)/) || msgLower.match(/above\s*\$?\s*(\d+)/);
    if (overMatch) {
      response.filters.minPrice = parseInt(overMatch[1], 10);
    }

    // Purpose extraction
    if (msgLower.includes('gaming')) {
      response.filters.purpose = 'gaming';
      response.intent = 'recommendation';
      response.apiAction = 'recommended_products';
    } else if (msgLower.includes('program') || msgLower.includes('code') || msgLower.includes('developer')) {
      response.filters.purpose = 'programming';
      response.intent = 'recommendation';
      response.apiAction = 'recommended_products';
    } else if (msgLower.includes('office') || msgLower.includes('work')) {
      response.filters.purpose = 'office';
    } else if (msgLower.includes('school') || msgLower.includes('student') || msgLower.includes('college')) {
      response.filters.purpose = 'school';
    }

    // General query if no category was extracted
    if (!response.filters.category) {
      response.filters.query = currentMessage;
    }

    // Response reply text
    const replyParts = [];
    if (response.intent === 'recommendation') {
      replyParts.push("Based on your request, I recommend these options");
    } else {
      replyParts.push("Here are the products matching your search");
    }

    if (response.filters.brand) replyParts.push(`from ${response.filters.brand}`);
    if (response.filters.category) replyParts.push(`in the ${response.filters.category} category`);
    if (response.filters.maxPrice !== null) replyParts.push(`under $${response.filters.maxPrice}`);
    if (response.filters.purpose) replyParts.push(`suited for ${response.filters.purpose}`);

    response.reply = replyParts.join(' ') + ':';
    return response;
  }

  if (prompt.includes('Given the following product raw JSON data, write a concise product summary')) {
    // Product Summary
    try {
      const marker = 'Product Data:';
      const startIndex = prompt.indexOf(marker);
      if (startIndex !== -1) {
        const afterData = prompt.substring(startIndex + marker.length).trim();
        const endIndex = afterData.indexOf('---');
        const jsonStr = endIndex !== -1 ? afterData.substring(0, endIndex).trim() : afterData;
        const product = JSON.parse(jsonStr);

        return {
          summary: `The ${product.title} by ${product.brand || 'Generic'} is a premium product in the ${product.category || 'general'} category. Priced at $${product.price}, it delivers a strong balance of performance, design, and user satisfaction, with an overall rating of ${product.rating || 4.5} out of 5 stars.`,
          pros: [
            `Highly rated at ${product.rating || 4.5}/5 stars`,
            `Attractive design and branding by ${product.brand || 'Generic'}`,
            `Excellent pricing value at $${product.price}`,
            `Belongs to the popular ${product.category || 'general'} selection`
          ],
          cons: [
            product.stock < 10 ? 'Very limited stock remaining' : 'Subject to availability',
            product.discountPercentage ? `Discounted by ${product.discountPercentage}% (limited time offer)` : 'No current discounts active'
          ]
        };
      }
    } catch (e) {
      console.warn('Failed to parse product for summary mock:', e);
    }
    
    return {
      summary: "This is a high-quality product matching your interest. It offers excellent build quality, premium specifications, and is highly reviewed by users.",
      pros: ["Great performance", "Premium build quality", "Good battery/durability"],
      cons: ["Higher price point", "Limited color options"]
    };
  }

  if (prompt.includes('Compare the two products below')) {
    // Product comparison
    try {
      const markerA = 'Product A Data:';
      const markerB = 'Product B Data:';
      const indexA = prompt.indexOf(markerA);
      const indexB = prompt.indexOf(markerB);
      
      if (indexA !== -1 && indexB !== -1) {
        const rawA = prompt.substring(indexA + markerA.length, indexB).trim();
        const rawB = prompt.substring(indexB + markerB.length).split('---')[0].trim();
        
        const productA = JSON.parse(rawA);
        const productB = JSON.parse(rawB);

        const diffPrice = Math.abs(productA.price - productB.price);
        const cheaperProduct = productA.price < productB.price ? productA : productB;
        const higherRated = productA.rating > productB.rating ? productA : productB;

        return {
          differences: [
            `Price: ${productA.title} is $${productA.price} while ${productB.title} is $${productB.price} (a difference of $${diffPrice}).`,
            `Rating: ${productA.title} has a user rating of ${productA.rating}/5, compared to ${productB.title} with ${productB.rating}/5.`,
            `Category: ${productA.title} is classified under ${productA.category}, and ${productB.title} is under ${productB.category}.`
          ],
          pros: {
            productA: [
              `Priced at $${productA.price}`,
              `Rated ${productA.rating}/5 stars by users`
            ],
            productB: [
              `Priced at $${productB.price}`,
              `Rated ${productB.rating}/5 stars by users`
            ]
          },
          cons: {
            productA: [
              `Stock: ${productA.stock} left`
            ],
            productB: [
              `Stock: ${productB.stock} left`
            ]
          },
          recommendation: `Both products have distinct advantages. If budget is your main priority, ${cheaperProduct.title} is the more cost-effective option. However, if user satisfaction is your guide, ${higherRated.title} has a slightly better customer rating. Both products offer excellent quality within their respective line-ups.`
        };
      }
    } catch (e) {
      console.warn('Failed to parse products for comparison mock:', e);
    }

    return {
      differences: [
        "Difference in pricing and value matching distinct budgets",
        "Different user ratings and overall customer feedback"
      ],
      pros: {
        productA: ["Compact design", "Budget friendly"],
        productB: ["Larger display/capacity", "Higher performance"]
      },
      cons: {
        productA: ["Fewer premium features"],
        productB: ["More expensive"]
      },
      recommendation: "Choose Product A if you want the best value for money. Choose Product B if you want absolute peak performance and features."
    };
  }

  return {
    intent: 'out_of_scope',
    requiresApiCall: false,
    apiAction: 'none',
    needsMoreInformation: false,
    missingInformation: [],
    filters: {},
    reply: "I'm sorry, I'm not sure how to handle that request. Please let me know how I can help you shop."
  };
}

