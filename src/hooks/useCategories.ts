import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/category.service';

/**
 * Custom hook to retrieve the list of product categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    staleTime: 24 * 60 * 60 * 1000, // Cache category definitions for 24 hours
  });
}

export default useCategories;
