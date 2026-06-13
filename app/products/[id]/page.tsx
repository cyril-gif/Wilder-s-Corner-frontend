'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProductById } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';
import { Star, ShoppingCart, Minus, Plus, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import ProductGrid from '@/components/products/ProductGrid';
import axios from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  const addItem = useCartStore((state) => state.addItem);

  // Submit review mutation
  const submitReview = useMutation({
  mutationFn: async () => {
    // Use the product's actual _id from the fetched product data
    if (!product?._id) throw new Error('Product ID not found');
    const response = await axios.post(`/products/${product._id}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  },
  onSuccess: () => {
    setReviewSuccess('Review submitted successfully!');
    setComment('');
    setRating(5);
    setReviewError('');
    queryClient.invalidateQueries({ queryKey: ['product', id] });
    setTimeout(() => setReviewSuccess(''), 3000);
  },
  onError: (err: any) => {
    setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    setTimeout(() => setReviewError(''), 3000);
  },
});
  
  const handleSubmitReview = () => {
    if (!user) {
      router.push('/auth/login?redirect=/products/' + id);
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please write a comment');
      return;
    }
    setSubmittingReview(true);
    submitReview.mutate(undefined, {
      onSettled: () => setSubmittingReview(false),
    });
  };

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
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
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
    router.push('/checkout');
  };

  // Calculate average rating
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

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
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
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

      {/* Tabs with Reviews */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews ({reviews.length})
          </TabsTrigger>
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
          {/* Write a review section */}
          <div className="mb-8 pb-4 border-b">
            <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
            {reviewError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                {reviewSuccess}
              </div>
            )}
            <div className="mb-3">
              <Label className="block mb-2">Your Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star className={`h-6 w-6 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <Label className="block mb-2">Your Review</Label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="bg-primary"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          {/* Customer reviews list */}
          <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                        <div className="flex text-yellow-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary">
                      <ThumbsUp className="h-3 w-3" /> Helpful (0)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <ProductGrid title="Related Products" filter={{ category: product.category?._id, limit: 4 }} limit={4} />
    </div>
  );
}
