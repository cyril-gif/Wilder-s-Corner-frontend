'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  title?: string;
  filter?: any;
  limit?: number;
}

export default function ProductGrid({ title, filter = {}, limit = 8 }: ProductGridProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => fetchProducts({ ...filter, limit }),
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

  if (!data?.products?.length) return null;

  return (
    <div className="mb-8">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}