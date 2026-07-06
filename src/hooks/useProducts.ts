import { useQuery } from '@tanstack/react-query';
import productService, { GetProductsParams } from '@/services/product.service';

/**
 * Custom hook to fetch products with pagination, category filter, and sorting
 */
export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData, // Smooth transitions during pagination (TanStack Query v5 standard)
  });
}

export default useProducts;
