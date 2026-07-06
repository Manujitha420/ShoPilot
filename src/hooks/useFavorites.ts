import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { Product } from '@/types';

// Helper to get local favorites array of product IDs
const getLocalFavorites = (): number[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('shopilot_favorites');
  return stored ? JSON.parse(stored) : [];
};

// Helper to save local favorites array of product IDs
const saveLocalFavorites = (ids: number[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('shopilot_favorites', JSON.stringify(ids));
};

/**
 * Custom hook managing the favorites list, utilizing TanStack Query mutations and cache invalidation.
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  // Query retrieving list of favorite IDs
  const { data: favoriteIds = [] } = useQuery<number[]>({
    queryKey: ['favorites', 'ids'],
    queryFn: getLocalFavorites,
    initialData: [],
  });

  // Query fetching details for each favorited product
  const { data: favoriteProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['favorites', 'products', favoriteIds],
    queryFn: async () => {
      if (!favoriteIds || favoriteIds.length === 0) return [];
      const promises = favoriteIds.map((id) => productService.getProductById(id));
      return Promise.all(promises);
    },
    enabled: favoriteIds.length > 0,
  });

  // Mutation to toggle product favorite state
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      // Simulate slight network latency
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const current = getLocalFavorites();
      const exists = current.includes(productId);
      let updated: number[];
      
      if (exists) {
        updated = current.filter((id) => id !== productId);
      } else {
        updated = [...current, productId];
      }
      
      saveLocalFavorites(updated);
      return { productId, isFavorite: !exists };
    },
    onSuccess: () => {
      // Invalidate the favorites list cache to force a refetch
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = (productId: number) => {
    return favoriteIds.includes(productId);
  };

  return {
    favoriteIds,
    favoriteProducts: favoriteIds.length === 0 ? [] : favoriteProducts,
    isLoading: isLoading && favoriteIds.length > 0,
    toggleFavorite: (productId: number) => toggleFavoriteMutation.mutate(productId),
    isToggling: toggleFavoriteMutation.isPending,
    isFavorite,
  };
}

export default useFavorites;
