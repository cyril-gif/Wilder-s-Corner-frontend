'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  slug: string;
}

export default function HeroBanner() {
  const { data, isLoading } = useQuery({
    queryKey: ['sliderProducts'],
    queryFn: () => fetchProducts({ limit: 20, sort: '-createdAt' }),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const products: ProductType[] = data?.products || [];
  const itemsPerPage = 2;
  const totalSlides = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length, totalSlides]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const visibleProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map((i: number) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-8 text-center mb-8">
        <p className="text-gray-500">No products available</p>
        <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mb-8 group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleProducts.map((product: ProductType) => {
          const price = product.discountPrice || product.price;
          const originalPrice = product.discountPrice ? product.price : null;
          const discountPercent = originalPrice 
            ? Math.round(((originalPrice - price) / originalPrice) * 100) 
            : 0;

          return (
            <Link href={`/products/${product.slug || product._id}`} key={product._id}>
              <div className="relative h-64 md:h-72 rounded-lg overflow-hidden cursor-pointer group/item">
                <Image
                  src={product.images?.[0] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
                  <div className="p-4 md:p-6">
                    {discountPercent > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded inline-block mb-2">
                        -{discountPercent}% OFF
                      </span>
                    )}
                    <h2 className="text-white text-lg md:text-xl font-bold line-clamp-2">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white text-lg md:text-xl font-bold">
                        ${price.toLocaleString()}
                      </span>
                      {originalPrice && (
                        <span className="text-gray-300 text-sm line-through">
                          ${originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button className="mt-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary/90 transition">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-r-lg p-2 opacity-0 group-hover:opacity-100 transition shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-l-lg p-2 opacity-0 group-hover:opacity-100 transition shadow-md"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}

      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-primary' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}