import React from 'react';
import type { Metadata } from 'next';
import productService from '@/services/product.service';
import ProductDetailClient from '@/components/product/ProductDetailClient';

// Pre-render top 30 product pages at build time
export async function generateStaticParams() {
  const ids = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO & OpenGraph metadata per product
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      return {
        title: 'Product Not Found | ShoPilot AI',
        description: 'The requested product could not be found in the catalog.',
      };
    }

    const title = `${product.title} - ${product.brand || 'ShoPilot'} | AI Shopping`;
    const description = product.description 
      ? product.description.substring(0, 160) 
      : `Buy ${product.title} on ShoPilot with AI-powered sentiment analysis and instant price comparisons.`;
    const imageUrl = product.thumbnail || product.images?.[0];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: imageUrl ? [{ url: imageUrl, alt: product.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product Catalog | ShoPilot AI Assistant',
      description: 'Explore products with real-time AI sentiment analysis and specifications.',
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  return <ProductDetailClient productId={productId} />;
}
