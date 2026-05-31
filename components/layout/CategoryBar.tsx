'use client';

import Link from 'next/link';

const categories = [
  { name: 'Shoes', slug: 'shoes', type: 'category' },
  { name: 'Belts', slug: 'belts', type: 'category' },
  { name: 'Hair Creams', slug: 'hair-creams', type: 'category' },
  { name: 'Jewellery', slug: 'jewellery', type: 'category' },
  { name: 'Bags', slug: 'bags', type: 'category' },
  { name: 'Flash Sales', slug: 'flash-sales', type: 'flash' },
  { name: 'New In', slug: 'new-in', type: 'new' },
];

export default function CategoryBar() {
  return (
    <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-6 py-3 whitespace-nowrap">
          {categories.map((cat) => {
            let href = '#';
            if (cat.type === 'category') {
              href = `/category/${cat.slug}`;        // ✅ CORRECT: single curly braces
            } else if (cat.type === 'flash') {
              href = '/products?isFlashSale=true';
            } else if (cat.type === 'new') {
              href = '/products?sort=-createdAt';
            }

            return (
              <Link
                key={cat.slug}
                href={href}
                className="text-gray-700 hover:text-primary font-medium text-sm transition"
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
