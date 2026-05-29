import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';

export function useProducts(filters: any, page: number, limit: number = 12) {
  return useQuery({
    queryKey: ['products', filters, page],
    queryFn: () => fetchProducts({ ...filters, page, limit }),
    staleTime: 5 * 60 * 1000,
  });
}

