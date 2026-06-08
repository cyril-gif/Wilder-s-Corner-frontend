'use client';

import Link from 'next/link';

const categories = [
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Belts', slug: 'belts' },
  { name: 'Hair Creams', slug: 'hair-creams' },
  { name: 'Jewellery', slug: 'jewellery' },
  { name: 'Bags', slug: 'bags' },
  { name: 'Flash Sales', slug: 'flash-sales' },
  { name: 'New In', slug: 'new-in' },
];

export default function CategoryBar() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[73px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-4 py-3 whitespace-nowrap scrollbar-hide">
          {categories.map((cat) => {
            let href = '#';
            if (cat.slug === 'flash-sales') {
              href = '/products?isFlashSale=true';
            } else if (cat.slug === 'new-in') {
              href = '/products?sort=-createdAt';
            } else {
              href = `/category/${cat.slug}`;
            }

            return (
              <Link
                key={cat.slug}
                href={href}
                className="text-gray-700 hover:text-primary font-medium text-sm transition flex-shrink-0"
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
