'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import axios from '@/lib/api';

// Ghana regions and cities data
const regionsWithCities: Record<string, string[]> = {
  'Greater Accra': ['Accra', 'Tema', 'Adenta', 'Madina', 'Ashaiman', 'Dansoman', 'Dzorwulu', 'Lapaz', 'Achimota', 'Osu'],
  'Ashanti': ['Kumasi', 'Obuasi', 'Tafo', 'Ejisu', 'Mampong', 'Konongo', 'Offinso', 'Agogo', 'Bekwai'],
  'Northern': ['Tamale', 'Sagnarigu', 'Yendi', 'Buipe', 'Salaga', 'Gushegu', 'Tolon', 'Kumbungu'],
  'Eastern': ['Koforidua', 'Nkawkaw', 'Suhum', 'Akropong', 'Aburi', 'Nsawam', 'Mpraeso'],
  'Central': ['Cape Coast', 'Kasoa', 'Winneba', 'Elmina', 'Twifo Praso', 'Assin Fosu', 'Apam'],
  'Volta': ['Ho', 'Hohoe', 'Keta', 'Denu', 'Kpando', 'Dzodze', 'Akatsi', 'Sogakope'],
  'Western': ['Takoradi', 'Sekondi', 'Tarkwa', 'Agona Nkwanta', 'Prestea', 'Bibiani', 'Enchi'],
  'Upper East': ['Bolgatanga', 'Bawku', 'Navrongo', 'Paga', 'Sandema', 'Zuarungu'],
  'Upper West': ['Wa', 'Jirapa', 'Nandom', 'Lawra', 'Tumu', 'Hamile', 'Daffiama'],
  'Bono': ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Nsoatre', 'Atebubu'],
  'Bono East': ['Techiman', 'Kintampo', 'Nkoranza', 'Atebubu', 'Prang'],
  'Ahafo': ['Goaso', 'Bechem', 'Duayaw Nkwanta', 'Kenyasi', 'Mim'],
  'Oti': ['Dambai', 'Jasikan', 'Kadjebi', 'Kete Krachi', 'Nkwanta'],
  'North East': ['Nalerigu', 'Bunkpurugu', 'Gambaga', 'Walewale', 'Yagaba'],
  'Savannah': ['Damango', 'Salaga', 'Daboya', 'Bole', 'Buipe'],
  'Western North': ['Sefwi Wiawso', 'Sefwi Asawinso', 'Sefwi Boako', 'Bibiani', 'Nkroful'],
};
const allRegions = Object.keys(regionsWithCities);

// Paystack button component - only renders on client side
// Paystack button component
function PaystackButton({ email, amount, orderId, onSuccess, onClose }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePayment = () => {
    if (!isMounted) return;
    setIsLoading(true);
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const pesewas = Math.round(amount * 100);
      if (isNaN(pesewas) || pesewas <= 0) {
        alert('Invalid payment amount');
        setIsLoading(false);
        return;
      }
      
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email,
        amount: pesewas,
        currency: 'GHS',
        ref: `ORDER-${orderId}-${Date.now()}`,
        metadata: { orderId },
        callback: (response: any) => {
          console.log('Payment success:', response);
          // Call the success callback to redirect
          onSuccess();
        },
        onClose: () => {
          console.log('Payment closed');
          setIsLoading(false);
          onClose();
        },
      });
      handler.openIframe();
    };
    script.onerror = () => {
      alert('Payment service unavailable');
      setIsLoading(false);
    };
    document.body.appendChild(script);
  };

  if (!isMounted) return null;

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !publicKey}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
    >
      {isLoading ? 'Processing...' : '💳 Pay Now'}
    </Button>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    region: '', city: '', postalCode: '', country: 'Ghana',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
    if (!user) router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
  }, [items.length, user, router]);

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number required';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Street address required';
    if (!address.region) newErrors.region = 'Select region';
    if (!address.city) newErrors.city = 'Select city';
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    const orderData = {
      orderItems: items.map(item => ({ product: item.productId, qty: item.qty, size: item.size, color: item.color })),
      shippingAddress: {
        fullName: address.fullName, phone: address.phone, addressLine1: address.addressLine1,
        addressLine2: address.addressLine2, city: address.city, state: address.region,
        postalCode: address.postalCode, country: 'Ghana',
      },
      paymentMethod, itemsPrice: subtotal, shippingPrice: shipping, totalPrice: total,
    };
    const { data } = await axios.post('/orders', orderData);
    return data.data;
  };

  const handleAddressSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateAddress()) setStep(2); };
  const handleCOD = async () => {
    setLoading(true);
    try {
      await createOrder();
      clearCart();
      router.push('/orders?success=true');
    } catch (err: any) { alert(err.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };
  const handlePaystackFlow = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      setCreatedOrderId(order._id);
    } catch (err: any) { alert(err.response?.data?.message || 'Order creation failed'); }
    finally { setLoading(false); }
  };
  const onPaystackSuccess = () => {
    clearCart();
    router.push('/orders?payment=success');
  };
  const onPaystackClose = () => setCreatedOrderId(null);

  const updateAddress = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'region') setAddress(prev => ({ ...prev, region: value, city: '' }));
  };

  const availableCities = address.region ? regionsWithCities[address.region] || [] : [];
  if (items.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= i ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>{i}</div>
                {i < 3 && <div className="w-12 md:w-20 h-0.5 bg-gray-200 mx-1 md:mx-2" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 md:gap-16 mt-2 text-xs md:text-sm text-gray-500">
            <span>Address</span><span>Payment</span><span>Review</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Shipping address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><Label>Full name</Label><Input value={address.fullName} onChange={e => updateAddress('fullName', e.target.value)} className="mt-1" />{errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}</div>
                    <div><Label>Phone number</Label><Input type="tel" value={address.phone} onChange={e => updateAddress('phone', e.target.value)} className="mt-1" />{errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}</div>
                  </div>
                  <div><Label>Street address</Label><Input value={address.addressLine1} onChange={e => updateAddress('addressLine1', e.target.value)} className="mt-1" />{errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}</div>
                  <div><Label>Address line 2 (optional)</Label><Input value={address.addressLine2} onChange={e => updateAddress('addressLine2', e.target.value)} className="mt-1" /></div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div><Label>Region</Label><select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.region} onChange={e => updateAddress('region', e.target.value)}><option value="">Select region</option>{allRegions.map(r => <option key={r} value={r}>{r}</option>)}</select>{errors.region && <p className="text-red-500 text-xs">{errors.region}</p>}</div>
                    <div><Label>City / Town</Label><select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.city} onChange={e => updateAddress('city', e.target.value)} disabled={!address.region}><option value="">Select city</option>{availableCities.map(c => <option key={c} value={c}>{c}</option>)}</select>{errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}</div>
                    <div><Label>Postal code</Label><Input value={address.postalCode} onChange={e => updateAddress('postalCode', e.target.value)} className="mt-1" />{errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}</div>
                  </div>
                  <div><Label>Country</Label><Input value="Ghana" disabled className="mt-1 bg-gray-100" /></div>
                  <Button type="submit" className="bg-primary w-full md:w-auto">Continue to payment <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </form>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Payment method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex justify-between items-center border rounded-xl p-4 hover:border-primary"><div className="flex items-center gap-3"><RadioGroupItem value="cash_on_delivery" id="cod" /><Label htmlFor="cod" className="font-medium">Cash on delivery</Label></div><span className="text-green-600 text-sm">Pay when you receive</span></div>
                  <div className="flex justify-between items-center border rounded-xl p-4 hover:border-primary"><div className="flex items-center gap-3"><RadioGroupItem value="paystack" id="paystack" /><Label htmlFor="paystack" className="font-medium">Card payment (Paystack)</Label></div><span className="text-blue-600 text-sm">Secure online payment</span></div>
                </RadioGroup>
                <div className="flex justify-between mt-8"><Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button><Button onClick={() => setStep(3)} className="bg-primary">Review order <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
              </div>
            )}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Review your order</h2>
                <div className="space-y-6">
                  <div><div className="flex justify-between mb-2"><h3 className="font-semibold">Shipping address</h3><button onClick={() => setStep(1)} className="text-primary text-sm">Edit</button></div><div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">{address.fullName}<br />{address.addressLine1}{address.addressLine2 && <>, {address.addressLine2}</>}<br />{address.city}, {address.region} {address.postalCode}<br />{address.phone}</div></div>
                  <div><div className="flex justify-between mb-2"><h3 className="font-semibold">Payment method</h3><button onClick={() => setStep(2)} className="text-primary text-sm">Edit</button></div><div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">{paymentMethod === 'cash_on_delivery' ? 'Cash on delivery' : 'Card (Paystack)'}</div></div>
                  <div className="border-t pt-4"><div className="flex justify-between text-gray-600 mb-2"><span>Subtotal</span><span>₵{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-gray-600 mb-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₵${shipping.toLocaleString()}`}</span></div><div className="flex justify-between text-xl font-bold mt-3 pt-3 border-t"><span>Total</span><span>₵{total.toLocaleString()}</span></div></div>
                  {paymentMethod === 'cash_on_delivery' ? (
                    <Button onClick={handleCOD} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Placing order...' : 'Place order (Cash on delivery)'}</Button>
                  ) : (
                    !createdOrderId ? (
                      <Button onClick={handlePaystackFlow} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Creating order...' : 'Proceed to payment'}</Button>
                    ) : (
                      <PaystackButton email={user.email} amount={total} orderId={createdOrderId} onSuccess={onPaystackSuccess} onClose={onPaystackClose} />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24"><h3 className="font-bold text-lg mb-4 pb-2 border-b">Order summary</h3><div className="space-y-3 max-h-96 overflow-y-auto">{items.map(item => <div key={item.productId} className="flex justify-between text-sm"><span className="text-gray-600">{item.name} × {item.qty}</span><span className="font-medium">₵{(item.price * item.qty).toLocaleString()}</span></div>)}</div><div className="border-t mt-4 pt-4"><div className="flex justify-between font-bold text-base"><span>Total</span><span>₵{total.toLocaleString()}</span></div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
