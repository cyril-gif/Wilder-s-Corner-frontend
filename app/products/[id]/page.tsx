'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useCartStore from '@/store/cartStore';
import ProductGrid from '@/components/products/ProductGrid';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const { items } = useCartStore();

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading product...</div>;
  if (error || !product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: price,
      image: product.images[0],
      qty: quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
    });
    // Optional: show a toast notification
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    // Add to cart first
    addItem({
      productId: product._id,
      name: product.name,
      price: price,
      image: product.images[0],
      qty: quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
    });
    // Then redirect to checkout
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex gap-2 mt-2">
            {product.images.slice(1, 5).map((img: string, i: number) => (
              <div key={i} className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden cursor-pointer">
                <Image src={img} alt={`${product.name} ${i+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.ratings) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
          </div>
          <div className="mb-4">
            <span className="text-3xl text-primary font-bold">₵{price.toLocaleString()}</span>
            {originalPrice && <span className="text-lg text-gray-400 line-through ml-2">₵{originalPrice.toLocaleString()}</span>}
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Variants */}
          {product.attributes?.size?.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2 flex-wrap">
                {product.attributes.size.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded px-3 py-1 text-sm ${selectedSize === size ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="border rounded p-2"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity+1))} className="border rounded p-2"><Plus className="h-4 w-4" /></button>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="bg-primary hover:bg-primary/90 flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="outline" className="flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="bg-white p-4 rounded-lg">
          {product.description}
        </TabsContent>
        <TabsContent value="specifications" className="bg-white p-4 rounded-lg">
          <ul>
            <li><strong>Brand:</strong> {product.brand || 'N/A'}</li>
            <li><strong>Category:</strong> {product.category?.name}</li>
            <li><strong>Material:</strong> {product.attributes?.material || 'N/A'}</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="bg-white p-4 rounded-lg">
          {product.reviews?.length === 0 ? <p>No reviews yet.</p> : product.reviews?.map((review: any) => (
            <div key={review._id} className="border-b py-3">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />)}
                </div>
                <span className="font-medium">{review.user?.name}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <ProductGrid title="Related Products" filter={{ category: product.category?._id, limit: 4 }} limit={4} />
    </div>
  );
}
