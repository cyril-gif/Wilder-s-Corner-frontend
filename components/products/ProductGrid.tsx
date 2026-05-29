'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  title?: string;
  filter?: any;
  limit?: number;
  pagination?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function ProductGrid({ 
  title, 
  filter = {}, 
  limit = 8, 
  pagination = false,
  page = 1,
  onPageChange 
}: ProductGridProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filter, page, limit],
    queryFn: () => fetchProducts({ ...filter, limit, page }),
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load products. Please try again.
      </div>
    );
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="mb-8">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && data.pagination && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === data.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}


