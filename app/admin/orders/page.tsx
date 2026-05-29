'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  _id: string;
  createdAt: string;
  user?: { name: string };
  totalPrice: number;
  paymentMethod: string;
  status: string;
  orderItems?: Array<{
    product: { _id: string; name: string };
    qty: number;
    price: number;
  }>;
}

interface ApiResponse {
  data: {
    orders: Order[];
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/orders?limit=50');
      setOrders(res.data.data.orders);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string): Promise<void> => {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders after status update
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
        <Button onClick={fetchOrders} className="mt-2" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders found</p>
              <p className="text-sm mt-1">Orders will appear here once customers place them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: {order.user?.name || 'Guest User'}
                      </p>
                      {order.orderItems && order.orderItems.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {order.orderItems.length} item(s)
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {order.paymentMethod.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <Select 
                      defaultValue={order.status} 
                      onValueChange={(val: string) => updateStatus(order._id, val)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}