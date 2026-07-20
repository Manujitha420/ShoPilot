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

const MOCK_PRODUCTS: Record<number, Partial<Product>> = {
  931: {
    id: 931,
    title: 'Aura Sound Max Wireless (Matte Black)',
    description: 'Experience studio-grade audio quality with Aura Sound Max Wireless headphones. Features active noise cancellation (ANC), premium memory foam earcups, and up to 40 hours of battery life on a single charge.',
    category: 'Electronics',
    price: 179.00,
    discountPercentage: 40,
    rating: 4.9,
    stock: 12,
    tags: ['electronics', 'headphones', 'audio'],
    brand: 'Aura',
    sku: 'AUR-SND-MX-BLK',
    weight: 0.35,
    dimensions: { width: 18, height: 20, depth: 8 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Absolutely incredible sound and the noise cancellation is top notch!', date: '2026-06-15T08:00:00Z', reviewerName: 'Alice S.', reviewerEmail: 'alice@example.com' },
      { rating: 4, comment: 'Very comfortable but a bit heavy after long hours.', date: '2026-07-02T08:00:00Z', reviewerName: 'Bob M.', reviewerEmail: 'bob@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  },
  901: {
    id: 901,
    title: 'Aura Sound Max Wireless',
    description: 'Experience studio-grade audio quality with Aura Sound Max Wireless headphones. Features active noise cancellation (ANC), premium memory foam earcups, and up to 40 hours of battery life on a single charge.',
    category: 'Electronics',
    price: 299.00,
    discountPercentage: 0,
    rating: 4.9,
    stock: 25,
    tags: ['electronics', 'headphones', 'audio'],
    brand: 'Aura',
    sku: 'AUR-SND-MX',
    weight: 0.35,
    dimensions: { width: 18, height: 20, depth: 8 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Absolutely incredible sound and the noise cancellation is top notch!', date: '2026-06-15T08:00:00Z', reviewerName: 'Alice S.', reviewerEmail: 'alice@example.com' },
      { rating: 5, comment: 'The best headphones I have ever owned.', date: '2026-07-02T08:00:00Z', reviewerName: 'Michael B.', reviewerEmail: 'mike@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  },
  932: {
    id: 932,
    title: 'Zenith Watch Pro Series 5',
    description: 'The Zenith Watch Pro Series 5 features a stunning dynamic OLED display, advanced heart rate monitoring, built-in GPS, sleep tracking, and up to 7 days of battery life. Designed to keep up with your active lifestyle.',
    category: 'Wearables',
    price: 226.85,
    discountPercentage: 35,
    rating: 4.8,
    stock: 5,
    tags: ['wearables', 'smartwatch', 'fitness'],
    brand: 'Zenith',
    sku: 'ZEN-WCH-PRO-5',
    weight: 0.05,
    dimensions: { width: 4.2, height: 4.8, depth: 1.1 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 2-3 business days',
    availabilityStatus: 'Low Stock',
    reviews: [
      { rating: 5, comment: 'Love the screen and fitness tracking is extremely accurate!', date: '2026-05-18T08:00:00Z', reviewerName: 'Sarah K.', reviewerEmail: 'sarah@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  902: {
    id: 902,
    title: 'Zenith Watch Pro',
    description: 'The Zenith Watch Pro features a stunning dynamic OLED display, advanced heart rate monitoring, built-in GPS, sleep tracking, and up to 7 days of battery life. Designed to keep up with your active lifestyle.',
    category: 'Wearables',
    price: 349.00,
    discountPercentage: 0,
    rating: 4.8,
    stock: 14,
    tags: ['wearables', 'smartwatch', 'fitness'],
    brand: 'Zenith',
    sku: 'ZEN-WCH-PRO',
    weight: 0.05,
    dimensions: { width: 4.2, height: 4.8, depth: 1.1 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 2-3 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Love the screen and fitness tracking is extremely accurate!', date: '2026-05-18T08:00:00Z', reviewerName: 'Sarah K.', reviewerEmail: 'sarah@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  933: {
    id: 933,
    title: 'Nova Mechanical Core Tactile Keyboard',
    description: 'Rethink typing with the Nova Mechanical Core Keyboard. Offering premium mechanical tactile switches, dynamic RGB backlighting, custom programming macros, and robust aircraft-grade aluminum construct.',
    category: 'Computing',
    price: 111.30,
    discountPercentage: 30,
    rating: 4.7,
    stock: 8,
    tags: ['computing', 'keyboard', 'gaming'],
    brand: 'Nova',
    sku: 'NOV-KEY-MCH-TCT',
    weight: 1.1,
    dimensions: { width: 44, height: 13, depth: 3.5 },
    warrantyInformation: '2 Years Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Feels amazing to type on. Highly recommend the tactile switches!', date: '2026-06-20T08:00:00Z', reviewerName: 'David H.', reviewerEmail: 'david@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
  },
  903: {
    id: 903,
    title: 'Nova Mechanical Core',
    description: 'Rethink typing with the Nova Mechanical Core Keyboard. Offering premium mechanical tactile switches, dynamic RGB backlighting, custom programming macros, and robust aircraft-grade aluminum construct.',
    category: 'Computing',
    price: 159.00,
    discountPercentage: 0,
    rating: 4.7,
    stock: 22,
    tags: ['computing', 'keyboard', 'gaming'],
    brand: 'Nova',
    sku: 'NOV-KEY-MCH',
    weight: 1.1,
    dimensions: { width: 44, height: 13, depth: 3.5 },
    warrantyInformation: '2 Years Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Feels amazing to type on. Highly recommend the tactile switches!', date: '2026-06-20T08:00:00Z', reviewerName: 'David H.', reviewerEmail: 'david@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
  },
  904: {
    id: 904,
    title: 'Lumina X-900 Mirrorless Camera',
    description: 'Capture life with breathtaking detail using the Lumina X-900 Mirrorless. Sporting a 45.7MP full-frame sensor, 8K video capturing, lightning fast autofocus, and weather-sealed build.',
    category: 'Photography',
    price: 1299.00,
    discountPercentage: 0,
    rating: 5.0,
    stock: 4,
    tags: ['photography', 'camera', 'mirrorless'],
    brand: 'Lumina',
    sku: 'LUM-CAM-X900',
    weight: 0.7,
    dimensions: { width: 14, height: 10, depth: 8 },
    warrantyInformation: '2 Years Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'Low Stock',
    reviews: [
      { rating: 5, comment: 'The image quality is pristine. 8K video is an absolute game changer!', date: '2026-07-01T08:00:00Z', reviewerName: 'Elena G.', reviewerEmail: 'elena@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
  },
  911: {
    id: 911,
    title: 'Ergonomic Mesh Task Chair',
    description: 'Sit in comfort with the Ergonomic Mesh Task Chair. Features adjustable lumbar support, 3D armrests, synchro-tilt mechanics, and a highly breathable premium mesh back.',
    category: 'Furniture',
    price: 249.00,
    discountPercentage: 0,
    rating: 4.6,
    stock: 15,
    tags: ['furniture', 'chair', 'office'],
    brand: 'ErgoComfort',
    sku: 'ERG-CHR-MSH',
    weight: 16.5,
    dimensions: { width: 68, height: 120, depth: 65 },
    warrantyInformation: '3 Years Warranty',
    shippingInformation: 'Ships in 3-5 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'My back pain is completely gone after using this chair.', date: '2026-06-12T08:00:00Z', reviewerName: 'James L.', reviewerEmail: 'james@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80'
  },
  912: {
    id: 912,
    title: 'Sonic Glow Smart Toothbrush',
    description: 'Elevate your dental care with the Sonic Glow Smart Toothbrush. Emits 40,000 vibrations per minute, connects to your smartphone for tracking, and includes 4 distinct cleaning modes.',
    category: 'Electronics',
    price: 89.00,
    discountPercentage: 0,
    rating: 4.5,
    stock: 30,
    tags: ['electronics', 'toothbrush', 'health'],
    brand: 'SonicGlow',
    sku: 'SON-TTH-GLW',
    weight: 0.2,
    dimensions: { width: 3, height: 25, depth: 3 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 4, comment: 'Teeth feel very clean. Battery lasts a long time!', date: '2026-07-10T08:00:00Z', reviewerName: 'Clara P.', reviewerEmail: 'clara@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1559592482-b288b5fc6d76?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1559592482-b288b5fc6d76?w=600&auto=format&fit=crop&q=80'
  },
  921: {
    id: 921,
    title: 'Hydration Therapy Essence',
    description: 'Infuse your skin with intense moisture. Our Hydration Therapy Essence is enriched with hyaluronic acid, green tea extracts, and peptides to plump, brighten, and refine your skin texture.',
    category: 'Beauty',
    price: 39.00,
    discountPercentage: 0,
    rating: 4.7,
    stock: 45,
    tags: ['beauty', 'skincare', 'essence'],
    brand: 'LumiSkin',
    sku: 'LUM-SKN-ESS',
    weight: 0.1,
    dimensions: { width: 4, height: 12, depth: 4 },
    warrantyInformation: 'No standard warranty on skincare items',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'My skin feels so soft and hydrated throughout the day.', date: '2026-07-05T08:00:00Z', reviewerName: 'Sophie T.', reviewerEmail: 'sophie@example.com' }
    ],
    returnPolicy: '15 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80'
  },
  922: {
    id: 922,
    title: 'Royal Oud Intense Cologne',
    description: 'An luxurious fragrance for those who demand excellence. Royal Oud Intense blends rare agarwood (oud), spicy cardamom, sweet amber, and cedarwood for a rich, warm, and sophisticated signature scent.',
    category: 'Fragrances',
    price: 145.00,
    discountPercentage: 0,
    rating: 4.8,
    stock: 18,
    tags: ['fragrances', 'perfume', 'cologne'],
    brand: 'RegalScent',
    sku: 'RGL-SNT-OUD',
    weight: 0.25,
    dimensions: { width: 6, height: 14, depth: 6 },
    warrantyInformation: 'No warranty on cosmetics',
    shippingInformation: 'Ships in 1-2 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Absolutely mesmerizing scent. Lasts all day and gets constant compliments!', date: '2026-06-30T08:00:00Z', reviewerName: 'Arthur P.', reviewerEmail: 'arthur@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'
  },
  923: {
    id: 923,
    title: 'Smart Ambient Desk Lamp',
    description: 'Perfect lighting for every task. The Smart Ambient Desk Lamp offers touchless controls, adjustable color temperatures (2700K - 6500K), schedules, and compatibility with Alexa & Google Home.',
    category: 'Furniture',
    price: 79.00,
    discountPercentage: 0,
    rating: 4.6,
    stock: 20,
    tags: ['furniture', 'lamp', 'smart-home'],
    brand: 'LuxLite',
    sku: 'LUX-LMP-SMT',
    weight: 1.2,
    dimensions: { width: 15, height: 45, depth: 15 },
    warrantyInformation: '1 Year Manufacturer Warranty',
    shippingInformation: 'Ships in 2-3 business days',
    availabilityStatus: 'In Stock',
    reviews: [
      { rating: 5, comment: 'Love the auto-dimming feature. Great addition to my home office.', date: '2026-07-14T08:00:00Z', reviewerName: 'Lucas V.', reviewerEmail: 'lucas@example.com' }
    ],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
  }
};

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
    if (id >= 900 && MOCK_PRODUCTS[id]) {
      return MOCK_PRODUCTS[id] as Product;
    }
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
