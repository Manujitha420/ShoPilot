import { NextRequest, NextResponse } from 'next/server';
import { callNvidiaAI } from '@/lib/ai/nvidiaClient';
import { buildChatPrompt, buildProductSummaryPrompt, buildProductComparisonPrompt } from '@/lib/ai/promptBuilder';
import productService from '@/services/product.service';

/**
 * AI Proxy Route Handler.
 * Integrates Nvidia Llama-3.3-70b-instruct to provide summaries, comparisons, and conversational shopping logic.
 */
export async function POST(req: NextRequest) {
  try {
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
              
              // Apply brand filters locally
              if (filters.brand) {
                list = list.filter((p) => 
                  p.brand?.toLowerCase().includes(filters.brand.toLowerCase())
                );
              }
              
              // Apply price filters locally
              if (filters.maxPrice) {
                list = list.filter((p) => p.price <= filters.maxPrice);
              }
              if (filters.minPrice) {
                list = list.filter((p) => p.price >= filters.minPrice);
              }

              products = list.slice(0, 4); // return top 4 matches
            } else if (filters.query) {
              // If a general search keyword is specified
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
              // Return generic products
              const res = await productService.getProducts({ limit: 4 });
              products = res.products;
            }
          } else if (action === 'featured_products') {
            // Get highest rated products
            const res = await productService.getProducts({
              limit: 4,
              sortBy: 'rating',
              order: 'desc',
            });
            products = res.products;
          }
        } catch (apiErr) {
          console.error('Error fetching live products for AI assistant:', apiErr);
          // Return empty array instead of failing the request
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
