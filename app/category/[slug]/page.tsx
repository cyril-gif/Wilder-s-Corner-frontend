'use client';

import { useParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function CategoryContent() {
  const { slug } = useParams();
  const [sort, setSort] = useState('-createdAt');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Fetch all categories to get the ID from slug
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('/categories');
      return data.data;
    },
  });

  // Find category ID based on slug
  useEffect(() => {
    if (categories && slug) {
      const found = categories.find((cat: any) => cat.slug === slug);
      if (found) {
        setCategoryId(found._id);
      }
    }
  }, [categories, slug]);

  // Fetch products for this category
  const { data, isLoading, error } = useQuery({
    queryKey: ['category-products', categoryId, sort],
    queryFn: async () => {
      if (!categoryId) return { products: [] };
      const { data } = await axios.get(`/products?category=${categoryId}&sort=${sort}`);
      return data.data;
    },
    enabled: !!categoryId,
  });

  const products = data?.products || [];

  // Format category name for display
  const categoryName = (slug as string)
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Category';

  if (!categories) {
    return <div className="p-8">Loading categories...</div>;
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest</SelectItem>
              <SelectItem value="-ratings">Top Rated</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="-sold">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found in {categoryName}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
