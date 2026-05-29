'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { createOrder } from '@/lib/api';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().min(10, 'Valid phone required'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  postalCode: z.string().min(4, 'Postal code required'),
  country: z.string().default('Nigeria'),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [address, setAddress] = useState<AddressForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Nigeria' }
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  if (!user) {
    router.push('/auth/login?redirect=/checkout');
    return null;
  }

  const onAddressSubmit = (data: AddressForm) => {
    setAddress(data);
    setStep(2);
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
              <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input {...register('fullName')} />
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input {...register('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input {...register('addressLine1')} />
                  {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
                </div>
                <div>
                  <Label>Address Line 2 (Optional)</Label>
                  <Input {...register('addressLine2')} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><Label>City</Label><Input {...register('city')} /></div>
                  <div><Label>State</Label><Input {...register('state')} /></div>
                  <div><Label>Postal Code</Label><Input {...register('postalCode')} /></div>
                </div>
                <div><Label>Country</Label><Input {...register('country')} readOnly className="bg-gray-100" /></div>
                <Button type="submit" className="bg-primary">Continue to Payment</Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-card">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <div className="flex items-center space-x-2 border p-3 rounded">
                  <RadioGroupItem value="cash_on_delivery" id="cod" />
                  <Label htmlFor="cod" className="flex-1">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded opacity-50">
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card" className="flex-1">Card Payment (Coming Soon)</Label>
                </div>
              </RadioGroup>
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
                  {address?.fullName}<br />
                  {address?.addressLine1}<br />
                  {address?.city}, {address?.state} {address?.postalCode}<br />
                  Phone: {address?.phone}
                </p>
                <button onClick={() => setStep(1)} className="text-primary text-sm">Edit</button>
              </div>
              <div className="space-y-3 mb-4">
                <h3 className="font-medium">Payment:</h3>
                <p className="text-sm">{paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}</p>
                <button onClick={() => setStep(2)} className="text-primary text-sm">Edit</button>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between mb-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
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
                  <span>₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
