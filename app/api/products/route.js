import { getProducts } from '@/app/actions/product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const options = {
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || 'active',
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12,
      price: searchParams.get('price') || undefined
    };

    const result = await getProducts(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}