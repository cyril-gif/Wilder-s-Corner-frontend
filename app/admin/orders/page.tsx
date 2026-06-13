'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Package, User, Phone } from 'lucide-react';

interface Order {
  _id: string;
  createdAt: string;
  user?: { name: string; email: string };
  totalPrice: number;
  paymentMethod: string;
  status: string;
  orderItems?: Array<{
    product: { _id: string; name: string };
    qty: number;
    price: number;
    name: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    area?: string;
    postalCode: string;
    country: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/admin/orders?limit=100');
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

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
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: {order.user?.name || 'Guest User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        ₵{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {order.paymentMethod?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.orderItems?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {item.name || item.product?.name} x {item.qty} - ₵{(item.price * item.qty).toLocaleString()}
                        </div>
                      ))}
                      {order.orderItems && order.orderItems.length > 2 && (
                        <p className="text-xs text-gray-400">
                          + {order.orderItems.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expand/Collapse Button for Shipping Address */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="mt-3 text-primary text-sm hover:underline flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    {expandedOrder === order._id ? 'Hide Shipping Details' : 'Show Shipping Address'}
                  </button>

                  {/* Full Shipping Address (Expandable) */}
                  {expandedOrder === order._id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Shipping Address
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="h-3 w-3 text-gray-400 mt-0.5" />
                          <span><strong>Name:</strong> {order.shippingAddress?.fullName || 'N/A'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="h-3 w-3 text-gray-400 mt-0.5" />
                          <span><strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                          <span><strong>Address:</strong> {order.shippingAddress?.addressLine1 || 'N/A'}</span>
                        </div>
                        {order.shippingAddress?.addressLine2 && (
                          <div className="ml-5"><strong>Address 2:</strong> {order.shippingAddress.addressLine2}</div>
                        )}
                        <div className="ml-5">
                          {order.shippingAddress?.area && <span><strong>Area:</strong> {order.shippingAddress.area}<br /></span>}
                          <span><strong>City:</strong> {order.shippingAddress?.city || 'N/A'}</span>
                          <span className="mx-2">|</span>
                          <span><strong>Region:</strong> {order.shippingAddress?.state || 'N/A'}</span>
                          <span className="mx-2">|</span>
                          <span><strong>Postal Code:</strong> {order.shippingAddress?.postalCode || 'N/A'}</span>
                        </div>
                        <div className="ml-5">
                          <strong>Country:</strong> {order.shippingAddress?.country || 'Ghana'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Update Section */}
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
