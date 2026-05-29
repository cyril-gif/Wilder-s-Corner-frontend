'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/api';
import { Package, CheckCircle, Truck, Clock } from 'lucide-react';

const fetchOrders = async () => {
  const { data } = await axios.get('/orders/my-orders');
  return data.data;
};

const statusIcon = (status: string) => {
  switch(status) {
    case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
    case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
    case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
    default: return <Package className="h-5 w-5" />;
  }
};

function OrdersContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const { data: orders, isLoading, error } = useQuery({ 
    queryKey: ['orders'], 
    queryFn: fetchOrders,
    retry: false,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Please login to view your orders.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Order placed successfully! We'll notify you when it ships.
        </div>
      )}
      {orders?.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No orders yet</p>
          <Link href="/products" className="text-primary hover:underline mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order: any) => (
            <div key={order._id} className="bg-white rounded-lg shadow-card p-4">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(order.status)}
                  <span className="capitalize font-medium">{order.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Paid'}</p>
                </div>
              </div>
              <div className="pt-3">
                {order.orderItems?.slice(0, 2).map((item: any) => (
                  <div key={item.product?._id || item.name} className="flex gap-3 text-sm py-1">
                    <span className="text-gray-600">{item.name} x{item.qty}</span>
                  </div>
                ))}
                {order.orderItems?.length > 2 && <p className="text-xs text-gray-400">+{order.orderItems.length - 2} more items</p>}
              </div>
              <Link href={`/orders/${order._id}`} className="text-primary text-sm hover:underline mt-2 inline-block">View Details →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
