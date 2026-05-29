'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { createOrder } from '@/lib/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  // Redirect if not logged in
  if (!user) {
    const redirectUrl = encodeURIComponent('/checkout');
    router.push(`/auth/login?redirect=${redirectUrl}`);
    return null;
  }

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName) newErrors.fullName = 'Full name required';
    if (!address.phone) newErrors.phone = 'Phone required';
    if (!address.addressLine1) newErrors.addressLine1 = 'Address required';
    if (!address.city) newErrors.city = 'City required';
    if (!address.state) newErrors.state = 'State required';
    if (!address.postalCode) newErrors.postalCode = 'Postal code required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(2);
    }
  };

  const placeOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.productId,
          qty: item.qty,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };
      await createOrder(orderData);
      clearCart();
      router.push('/orders?success=true');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAddress = (field: string, value: string) => {
    setAddress({ ...address, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="flex gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-card">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      value={address.fullName}
                      onChange={(e) => updateAddress('fullName', e.target.value)}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      value={address.phone}
                      onChange={(e) => updateAddress('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input 
                    value={address.addressLine1}
                    onChange={(e) => updateAddress('addressLine1', e.target.value)}
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                </div>
                <div>
                  <Label>Address Line 2 (Optional)</Label>
                  <Input 
                    value={address.addressLine2}
                    onChange={(e) => updateAddress('addressLine2', e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input 
                      value={address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input 
                      value={address.state}
                      onChange={(e) => updateAddress('state', e.target.value)}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input 
                      value={address.postalCode}
                      onChange={(e) => updateAddress('postalCode', e.target.value)}
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={address.country} readOnly className="bg-gray-100" />
                </div>
                <Button type="submit" className="bg-primary">Continue to Payment</Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-card">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 border p-3 rounded cursor-pointer">
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">Cash on Delivery</span>
                </label>
                <div className="flex items-center space-x-2 border p-3 rounded opacity-50">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="flex-1">Card Payment (Coming Soon)</span>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} className="bg-primary">Review Order</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-card">
              <h2 className="text-lg font-semibold mb-4">Review Order</h2>
              <div className="space-y-3 mb-4">
                <h3 className="font-medium">Shipping to:</h3>
                <p className="text-sm text-gray-600">
                  {address.fullName}<br />
                  {address.addressLine1}<br />
                  {address.city}, {address.state} {address.postalCode}<br />
                  Phone: {address.phone}
                </p>
                <button onClick={() => setStep(1)} className="text-primary text-sm hover:underline">Edit</button>
              </div>
              <div className="space-y-3 mb-4">
                <h3 className="font-medium">Payment:</h3>
                <p className="text-sm">{paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}</p>
                <button onClick={() => setStep(2)} className="text-primary text-sm hover:underline">Edit</button>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <Button onClick={placeOrder} disabled={isSubmitting} className="w-full mt-4 bg-primary">
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80">
          <div className="bg-gray-50 p-4 rounded-lg sticky top-24">
            <h3 className="font-semibold mb-3">Order Items ({items.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.qty}</span>
                  <span>${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}