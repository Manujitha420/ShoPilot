import axios from 'axios';
import { Product } from '@/types';

export interface GetSummaryParams {
  product: Product;
}

export interface GetAiRecommendationParams {
  query: string;
  products: Product[];
}

export const aiService = {
  /**
   * Send a query message to the local AI assistant chat endpoint
   */
  chat: async (message: string, history: { role: string; content: string }[]) => {
    const response = await axios.post('/api/ai', {
      type: 'chat',
      message,
      history,
    });
    return response.data;
  },

  /**
   * Retrieve a summary analysis of a product (pros, cons, buying advice)
   */
  getSummary: async (product: Product) => {
    const response = await axios.post('/api/ai', {
      type: 'summary',
      product,
    });
    return response.data;
  },

  /**
   * Compare two products side by side using NVIDIA NIM
   */
  compare: async (productA: Product, productB: Product) => {
    const response = await axios.post('/api/ai', {
      type: 'compare',
      productA,
      productB,
    });
    return response.data;
  },
};

export default aiService;
