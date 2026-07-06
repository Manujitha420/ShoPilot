import { useQuery } from '@tanstack/react-query';
import productService, { SearchProductsParams } from '@/services/product.service';

/**
 * Custom hook to execute keyword searches against the product catalog
 */
export function useSearchProducts(params: SearchProductsParams) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => productService.searchProducts(params),
    enabled: params.query.trim().length > 0, // Avoid triggering API for empty queries
    placeholderData: (previousData) => previousData,
  });
}

export default useSearchProducts;
