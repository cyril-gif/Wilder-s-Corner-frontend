/* 'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductSlider() {
  const { data, isLoading } = useQuery({
    queryKey: ['sliderProducts'],
    queryFn: () => fetchProducts({ limit: 10, sort: '-createdAt' }),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const products = data?.products || [];

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (isLoading || products.length === 0) {
    return (
      <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-400">Loading products...</span>
      </div>
    );
  }

  const product = products[currentIndex];
  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="relative mb-8 group">
      <Link href={`/products/${product.slug || product._id}`}>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden cursor-pointer">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="text-white p-6 md:p-8 max-w-md">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                {discountPercent > 0 ? `-${discountPercent}% OFF` : 'HOT DEAL'}
              </span>
              <h2 className="text-xl md:text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-sm md:text-base text-gray-200 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl md:text-2xl font-bold">₦{price.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-sm text-gray-300 line-through">₦{originalPrice.toLocaleString()}</span>
                )}
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition">
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* 
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicato
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition ${
              idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
} */

