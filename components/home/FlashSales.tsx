'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '../products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FlashSales() {
  const { data, isLoading } = useQuery({
    queryKey: ['flashSales'],
    queryFn: () => fetchProducts({ isFlashSale: true, limit: 10 }),
  });

  if (isLoading) return <FlashSalesSkeleton />;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-600">⚡ Flash Sales</h2>
        <span className="text-sm text-gray-500">Ends in 02:15:30</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data?.products?.slice(0, 5).map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

function FlashSalesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  );
}

