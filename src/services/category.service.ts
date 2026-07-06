import axiosInstance from '@/lib/axios';
import { Category } from '@/types';

export const categoryService = {
  /**
   * Fetch all product categories for filtering
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[] | string[]>('/products/categories');
    
    // Normalize return type: newer versions of DummyJSON return an array of objects
    // while older versions might return an array of strings.
    if (Array.isArray(response.data)) {
      return response.data.map((item) => {
        if (typeof item === 'string') {
          return {
            slug: item,
            name: item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            url: `https://dummyjson.com/products/category/${item}`
          };
        }
        return item;
      });
    }
    return [];
  },
};

export default categoryService;
