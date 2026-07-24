import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export interface AgenticAction {
  type: 'add_to_cart' | 'filter_products' | 'navigate' | 'none';
  params?: {
    productId?: number | null;
    productName?: string;
    route?: string;
    filters?: {
      category?: string;
      maxPrice?: number | null;
      query?: string;
    };
  };
}

export function useAgenticActions() {
  const router = useRouter();

  const executeAction = async (action: AgenticAction, contextProducts?: Product[] | Product | null) => {
    if (!action || action.type === 'none') return null;

    switch (action.type) {
      case 'add_to_cart': {
        const { productId, productName } = action.params || {};
        let targetProduct: any = null;

        // 1. Check if the active context is a single product (for detail page)
        if (contextProducts && !Array.isArray(contextProducts)) {
          const product = contextProducts as Product;
          if (productId && product.id === productId) {
            targetProduct = product;
          } else if (productName && product.title.toLowerCase().includes(productName.toLowerCase())) {
            targetProduct = product;
          } else if (!productId && !productName) {
            // Default to current page's product if no params are specified
            targetProduct = product;
          }
        }

        // 2. Try to find the product in a list of context products
        if (!targetProduct && contextProducts && Array.isArray(contextProducts)) {
          const products = contextProducts as Product[];
          if (productId) {
            targetProduct = products.find((p) => p.id === productId);
          }
          if (!targetProduct && productName) {
            targetProduct = products.find((p) => 
              p.title.toLowerCase().includes(productName.toLowerCase())
            );
          }
        }

        // 3. If not found in context, fetch from the API as a fallback
        if (!targetProduct && productId) {
          try {
            const res = await fetch(`https://dummyjson.com/products/${productId}`);
            if (res.ok) {
              targetProduct = await res.json();
            }
          } catch (err) {
            console.error('Failed to fetch product for cart action:', err);
          }
        }

        // 4. Add the product to the shopping cart
        if (targetProduct) {
          const cartData = localStorage.getItem('shopilot_cart');
          const cartItems: any[] = cartData ? JSON.parse(cartData) : [];
          
          const existingItemIndex = cartItems.findIndex(
            (item: any) => item.product.id === targetProduct.id
          );
          
          if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1;
          } else {
            cartItems.push({
              product: targetProduct,
              quantity: 1,
              variant: 'Standard / Default'
            });
          }
          
          localStorage.setItem('shopilot_cart', JSON.stringify(cartItems));
          // Dispatch events so that layout cart badges recalculate instantly
          window.dispatchEvent(new Event('shopilot_cart_update'));
          return { success: true, message: `Added ${targetProduct.title} to your cart!` };
        }
        return { success: false, message: 'Could not resolve the product to add to cart.' };
      }

      case 'navigate': {
        const route = action.params?.route;
        if (route) {
          router.push(route);
          return { success: true, message: `Navigating to ${route}...` };
        }
        return { success: false, message: 'No route specified.' };
      }

      case 'filter_products': {
        const filters = action.params?.filters || {};
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.set('category', filters.category);
        if (filters.maxPrice) queryParams.set('maxPrice', String(filters.maxPrice));
        if (filters.query) queryParams.set('search', filters.query);

        const targetUrl = `/products?${queryParams.toString()}`;
        router.push(targetUrl);
        return { success: true, message: `Filtered products list.` };
      }

      default:
        return null;
    }
  };

  return { executeAction };
}
