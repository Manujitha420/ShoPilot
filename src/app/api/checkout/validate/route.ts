import { NextRequest, NextResponse } from 'next/server';
import productService from '@/services/product.service';

interface CartInputItem {
  productId: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, discountCode } = body as { items: CartInputItem[]; discountCode?: string };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items provided for validation.' },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const validatedItems = [];

    // Recalculate prices from canonical server data to prevent client-side price tampering
    for (const item of items) {
      try {
        const product = await productService.getProductById(item.productId);
        if (product) {
          const qty = Math.max(1, item.quantity || 1);
          const itemPrice = product.price;
          const itemTotal = itemPrice * qty;
          subtotal += itemTotal;

          validatedItems.push({
            productId: product.id,
            title: product.title,
            canonicalPrice: itemPrice,
            quantity: qty,
            total: itemTotal,
            thumbnail: product.thumbnail,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch product ${item.productId} during checkout validation:`, err);
      }
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Could not validate items against current catalog.' },
        { status: 400 }
      );
    }

    // Apply promo code logic server-side
    let discountAmount = 0;
    if (discountCode?.toUpperCase() === 'AISHOP20') {
      discountAmount = subtotal * 0.2; // 20% discount
    }

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = (subtotal - discountAmount) * 0.08; // 8% estimated tax
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping + tax);

    return NextResponse.json({
      success: true,
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      validatedItems,
    });
  } catch (error: any) {
    console.error('Checkout validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Server-side checkout validation failed.' },
      { status: 500 }
    );
  }
}
