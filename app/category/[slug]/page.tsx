'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

function CategoryContent() {
  const { slug } = useParams();
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // First, fetch all categories to get the category ID from slug
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      return data.data;
    },
  });

  // Find the category ID based on the slug
  useEffect(() => {
    if (categoriesData && slug) {
      const category = categoriesData.find((cat: any) => cat.slug === slug);
      if (category) {
        setCategoryId(category._id);
      }
    }
  }, [categoriesData, slug]);

  // Fetch products filtered by category
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', categoryId, sort, page],
    queryFn: () => fetchProducts({ category: categoryId, sort, page, limit: 12 }),
    enabled: !!categoryId, // Only fetch when categoryId is available
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const categoryName = (slug as string)
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Category';

  if (!categoryId && categoriesData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
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
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading category...</div>}>
      <CategoryContent />
    </Suspense>
  );
}

