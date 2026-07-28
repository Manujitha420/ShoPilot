import { NextRequest, NextResponse } from 'next/server';
import { callNvidiaAI } from '@/lib/ai/nvidiaClient';
import { buildChatPrompt, buildProductSummaryPrompt, buildProductComparisonPrompt } from '@/lib/ai/promptBuilder';
import productService from '@/services/product.service';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * AI Proxy Route Handler.
 * Integrates Nvidia Llama-3.3-70b-instruct to provide summaries, comparisons, and conversational shopping logic.
 * Rate limited to 15 requests per minute per client IP to prevent quota exhaustion.
 */
export async function POST(req: NextRequest) {
  try {
    // Extract Client IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'anonymous_client';

    // Rate limit check: Max 15 requests per 60 seconds per IP
    const rateLimit = checkRateLimit(ip, { limit: 15, windowMs: 60000 });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many AI requests. Please wait ${Math.ceil(rateLimit.resetMs / 1000)} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetMs / 1000).toString(),
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await req.json();
    const { type } = body;

    // 1. PRODUCT SUMMARY USE CASE
    if (type === 'summary') {
      const { product } = body;
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product data is required.' }, { status: 400 });
      }
      const prompt = buildProductSummaryPrompt(JSON.stringify(product));
      const aiResponse = await callNvidiaAI({ prompt });
      return NextResponse.json(aiResponse);
    }

    // 2. PRODUCT COMPARISON USE CASE
    if (type === 'compare') {
      const { productA, productB } = body;
      if (!productA || !productB) {
        return NextResponse.json({ success: false, error: 'Both products A and B are required.' }, { status: 400 });
      }
      const prompt = buildProductComparisonPrompt(JSON.stringify(productA), JSON.stringify(productB));
      const aiResponse = await callNvidiaAI({ prompt });
      return NextResponse.json(aiResponse);
    }

    // 3. AI CHAT / SHOPPING ASSISTANT USE CASE
    if (type === 'chat') {
      const { message, history = [] } = body;
      if (!message) {
        return NextResponse.json({ success: false, error: 'Message content is required.' }, { status: 400 });
      }

      const prompt = buildChatPrompt(history, message);
      const aiResponse = await callNvidiaAI({ prompt });

      // If the AI states an API call is required, execute queries on the server side
      let products: any[] = [];
      if (aiResponse.requiresApiCall && !aiResponse.needsMoreInformation) {
        const action = aiResponse.apiAction;
        const filters = aiResponse.filters || {};

        try {
          if (action === 'search_products' || action === 'recommended_products') {
            if (filters.category) {
              const res = await productService.getProducts({
                category: filters.category,
                limit: 10,
              });
              let list = res.products;
              
              if (filters.brand) {
                list = list.filter((p) => 
                  p.brand?.toLowerCase().includes(filters.brand.toLowerCase())
                );
              }
              
              if (filters.maxPrice) {
                list = list.filter((p) => p.price <= filters.maxPrice);
              }
              if (filters.minPrice) {
                list = list.filter((p) => p.price >= filters.minPrice);
              }

              products = list.slice(0, 4);
            } else if (filters.query) {
              const res = await productService.searchProducts({
                query: filters.query,
                limit: 10,
              });
              let list = res.products;

              if (filters.maxPrice) {
                list = list.filter((p) => p.price <= filters.maxPrice);
              }

              products = list.slice(0, 4);
            } else {
              const res = await productService.getProducts({ limit: 4 });
              products = res.products;
            }
          } else if (action === 'featured_products') {
            const res = await productService.getProducts({
              limit: 4,
              sortBy: 'rating',
              order: 'desc',
            });
            products = res.products;
          }
        } catch (apiErr) {
          console.error('Error fetching live products for AI assistant:', apiErr);
        }
      }

      return NextResponse.json({
        ...aiResponse,
        products,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid interaction type.' }, { status: 400 });
  } catch (error: any) {
    console.error('AI Proxy Route Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'AI request failed.',
    }, { status: 500 });
  }
}
export default POST;
