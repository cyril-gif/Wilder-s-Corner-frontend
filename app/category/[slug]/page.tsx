'use client';

import { useParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function CategoryContent() {
  const { slug } = useParams();
  const [filters, setFilters] = useState({
    category: slug as string,
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

  const categoryName = (slug as string)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="md:w-72 flex-shrink-0">
        <FilterSidebar filters={filters} updateFilter={updateFilter} />
      </aside>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h1 className="text-xl font-bold">{categoryName}</h1>
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
        <ProductGrid filter={filters} limit={12} />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
