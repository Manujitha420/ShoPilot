import axiosInstance from '@/lib/axios';
import { Product, ProductsResponse } from '@/types';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface SearchProductsParams {
  query: string;
  limit?: number;
  skip?: number;
}

export const productService = {
  /**
   * Fetch a paginated/filtered list of products
   */
  getProducts: async ({
    limit = 10,
    skip = 0,
    category,
    sortBy,
    order,
  }: GetProductsParams = {}): Promise<ProductsResponse> => {
    let url = '/products';
    const params: Record<string, any> = { limit, skip };

    if (category) {
      url = `/products/category/${category}`;
    }

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order || 'asc';
    }

    const response = await axiosInstance.get<ProductsResponse>(url, { params });
    return response.data;
  },

  /**
   * Fetch a single product's detailed specifications
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Perform free text search on products
   */
  searchProducts: async ({
    query,
    limit = 10,
    skip = 0,
  }: SearchProductsParams): Promise<ProductsResponse> => {
    const response = await axiosInstance.get<ProductsResponse>('/products/search', {
      params: { q: query, limit, skip },
    });
    return response.data;
  },
};

export default productService;
