'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      price: price,
      image: product.images[0],
      qty: 1,
      stock: product.stock,
    });
  };

  return (
    <Link href={`/products/${product.slug || product._id}`}>
      <div className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-md transition group">
        <div className="relative h-48 bg-gray-100">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition" />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No image</div>
          )}
          {product.discountPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm text-yellow-500 mb-1">
            <Star className="h-3 w-3 fill-current" />
            <span>{product.ratings || 0}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-primary font-bold">${price.toLocaleString()}</span>
              {originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${originalPrice.toLocaleString()}</span>}
            </div>
            <Button size="sm" onClick={handleAddToCart} className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
