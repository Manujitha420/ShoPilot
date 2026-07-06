import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';

/**
 * Custom hook to fetch a single product's detail by ID
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id && !isNaN(id),
  });
}

export default useProduct;
