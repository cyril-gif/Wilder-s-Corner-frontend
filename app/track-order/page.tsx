'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Truck, Clock, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/api';
import useAuthStore from '@/store/authStore';

interface OrderStatus {
  _id: string;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  orderItems: Array<{
    name: string;
    qty: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
  };
  totalPrice: number;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
  { key: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-500' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
];

function TrackOrderContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    // If not logged in, redirect to login page
    if (!user) {
      router.push(`/auth/login?redirect=/track-order&orderId=${orderId}`);
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await axios.get(`/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Order not found. Please check your order ID.');
      } else if (err.response?.status === 401) {
        setError('Please login to track this order.');
        setTimeout(() => router.push('/auth/login?redirect=/track-order'), 2000);
      } else {
        setError('Failed to fetch order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    const status = order?.status || 'pending';
    return statusSteps.findIndex(step => step.key === status);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
      <p className="text-gray-500 mb-6">Enter your order ID to see the current status</p>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="Enter order ID (e.g., 65a1b2c3d4e5f67890abcdef)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-primary" disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Searching...' : 'Track Order'}
        </Button>
      </form>

      {/* Not Logged In Message */}
      {!user && !loading && !order && !error && (
        <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200">
          <Package className="h-16 w-16 mx-auto text-yellow-500 mb-3" />
          <p className="text-gray-700 mb-2">Please login to track your order</p>
          <Button onClick={() => router.push('/auth/login?redirect=/track-order')} className="bg-primary mt-2">
            Login Now
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Status Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex justify-between">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= getCurrentStepIndex();
                    const isCurrent = idx === getCurrentStepIndex();
                    
                    return (
                      <div key={step.key} className="flex-1 text-center relative">
                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                        } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`text-xs mt-2 font-medium ${isCompleted ? 'text-primary' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Bar */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-medium">#{order._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-primary">₵{order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-2">
                  <p className="text-sm font-medium mb-2">Items:</p>
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span>{item.name} x{item.qty}</span>
                      <span>₵{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.addressLine1}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Estimate */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-gray-600">
                  {order.status === 'delivered' 
                    ? '✓ Order delivered successfully!' 
                    : order.status === 'shipped'
                    ? 'Your order is on the way! Expected within 3-5 business days.'
                    : 'Processing your order. You will receive updates soon.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
