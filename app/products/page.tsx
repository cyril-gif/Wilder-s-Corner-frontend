'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialFlashSale = searchParams.get('flashSale') === 'true';

  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    isFlashSale: initialFlashSale,
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    inStock: '',
  });

  const [page, setPage] = useState(1);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Sync URL query params into filters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: initialCategory,
      search: initialSearch,
      isFlashSale: initialFlashSale,
    }));
  }, [initialCategory, initialSearch, initialFlashSale]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="md:w-72 flex-shrink-0">
        <FilterSidebar filters={filters} updateFilter={updateFilter} />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="text-sm text-gray-500">Showing products</div>
          <Select value={filters.sort} onValueChange={(val) => updateFilter('sort', val)}>
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

        <ProductGrid 
          filter={filters} 
          limit={12} 
          pagination 
          page={page} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

