'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/api';
import Image from 'next/image';
import { Package, MapPin, CreditCard } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const fetchOrder = async (id: string) => {
  const { data } = await axios.get(`/orders/${id}`);
  return data.data;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id as string),
    retry: false,
    enabled: !!user, // Only fetch if user is logged in
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Please login to view order details.</p>
        <a href="/auth/login" className="text-primary hover:underline mt-2 inline-block">
          Go to Login
        </a>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Order not found.</p>
        <a href="/orders" className="text-primary hover:underline mt-2 inline-block">
          Back to My Orders
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
        <span className="capitalize bg-gray-100 px-3 py-1 rounded-full text-sm">{order.status}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-card p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4" /> Order Items</h2>
            <div className="space-y-3">
              {order.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 border-b pb-3">
                  <div className="h-16 w-16 bg-gray-100 rounded relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty} × ₵{item.price.toLocaleString()}</p>
                  </div>
                  <div className="font-semibold">₵{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-4">
            <h2 className="font-semibold mb-3">Order Timeline</h2>
            <div className="relative pl-6 border-l-2 border-gray-200 ml-2 space-y-4">
              <div>
                <div className="absolute -left-2 w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              {order.isPaid && (
                <div>
                  <div className="absolute -left-2 w-4 h-4 bg-green-500 rounded-full"></div>
                  <p className="font-medium">Payment Confirmed</p>
                  <p className="text-sm text-gray-500">{new Date(order.paidAt).toLocaleString()}</p>
                </div>
              )}
              {order.isDelivered && (
                <div>
                  <div className="absolute -left-2 w-4 h-4 bg-green-500 rounded-full"></div>
                  <p className="font-medium">Delivered</p>
                  <p className="text-sm text-gray-500">{new Date(order.deliveredAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card p-4">
            <h2 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h2>
            <p className="text-sm">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.addressLine1}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-card p-4">
            <h2 className="font-semibold mb-2 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₵{order.itemsPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₵{order.shippingPrice?.toLocaleString()}</span></div>
              <div className="border-t pt-1 mt-1 font-bold flex justify-between"><span>Total</span><span>₵{order.totalPrice?.toLocaleString()}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Payment: {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
