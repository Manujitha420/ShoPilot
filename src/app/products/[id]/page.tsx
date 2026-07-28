import React from 'react';
import ProductDetailClient from '@/components/product/ProductDetailClient';

// Pre-render top 30 product pages at build time
export async function generateStaticParams() {
  const ids = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  return ids.map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  return <ProductDetailClient productId={productId} />;
}
