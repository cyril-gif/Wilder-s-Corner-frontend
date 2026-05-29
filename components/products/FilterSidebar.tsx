'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';

interface FilterSidebarProps {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    inStock: string;
    // ... other filters
  };
  updateFilter: (key: string, value: any) => void;
}

export default function FilterSidebar({ filters, updateFilter }: FilterSidebarProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-card space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={() => updateFilter('category', '')}
            />
            All
          </label>
          {categories?.map((cat: any) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={filters.category === cat.slug}
                onChange={() => updateFilter('category', cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
          />
          In Stock Only
        </label>
      </div>

      {/* Clear Filters Button */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock) && (
        <Button
          variant="outline"
          onClick={() => {
            updateFilter('category', '');
            updateFilter('minPrice', '');
            updateFilter('maxPrice', '');
            updateFilter('inStock', '');
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
