'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import axios from '@/lib/api';

// Ghana regions with cities and areas
const locationData: Record<string, Record<string, string[]>> = {
  'Greater Accra': {
    'Accra': ['Airport Residential', 'Cantonments', 'Labone', 'Osu', 'East Legon', 'West Legon', 'Dzorwulu', 'Achimota'],
    'Tema': ['Community 1', 'Community 2', 'Community 3', 'Community 4', 'Community 5', 'Community 6', 'Community 7', 'Community 8', 'Community 9', 'Community 10', 'Community 11', 'Community 12', 'Community 25'],
    'Adenta': ['Adenta New Site', 'Adenta Old Site', 'Adenta West Hills'],
    'Madina': ['Madina Zongo', 'Madina Estate', 'Madina New Road'],
  },
  'Ashanti': {
    'Kumasi': ['Adum', 'Bantama', 'Asokwa', 'Tafo', 'Oforikrom', 'Santasi', 'Ahinsan', 'Atonsu', 'Kwadaso', 'Patasi'],
    'Obuasi': ['Obuasi Central', 'Bekwai', 'Akaporiso'],
  },
  'Northern': {
    'Tamale': ['Zogbeli', 'Lamashegu', 'Dungu', 'Bilpela', 'Gumani', 'Dabokpa', 'Kukuo', 'Choggu', 'Vitting', 'Jisonaayili'],
  },
  'Volta': {
    'Ho': ['Ho Bankoe', 'Ho Dome', 'Ho Kpodzi', 'Ho Fiave'],
    'Hohoe': ['Hohoe Central', 'Gbi', 'Akpafu'],
  },
  'Western': {
    'Takoradi': ['Apremdo', 'Anaji', 'Effiakuma', 'Kansaworado', 'Nkontompo', 'New Takoradi', 'Kwesimintsim'],
    'Sekondi': ['Essikado', 'Sekondi Central', 'Kojokrom'],
  },
  'Central': {
    'Cape Coast': ['Amamoma', 'Kakumdo', 'Adisadel', 'Nkanfoa', 'Pedu'],
    'Kasoa': ['Iron City', 'Opeikuma', 'Akweley', 'Lamptey Mills'],
  },
  'Eastern': {
    'Koforidua': ['Betom', 'Srodae', 'Adweso', 'Effiduase', 'New Juaben'],
    'Nkawkaw': ['Nkawkaw Central', 'Mpraeso', 'Abetifi'],
  },
  'Bono': {
    'Sunyani': ['New Dumasua', 'Penkwase', 'Nkwabeng', 'Fiapre'],
    'Berekum': ['Berekum Central', 'Kato', 'Senase'],
  },
  'Upper West': {
    'Wa': ['Wa Central', 'Dobile', 'Kambali', 'Kpongu', 'Sombo', 'Wa Zongo'],
  },
  'Upper East': {
    'Bolgatanga': ['Bolgatanga Central', 'Zuarungu', 'Bongo'],
    'Bawku': ['Bawku Central', 'Manga', 'Zebilla'],
  },
};

const allRegions = Object.keys(locationData);

const getCities = (region: string) => Object.keys(locationData[region] || {});
const getAreas = (region: string, city: string) => locationData[region]?.[city] || [];

// Paystack button component
function PaystackButton({ email, amount, orderId, onSuccess, onClose }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const handlePayment = () => {
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const pesewas = Math.round(amount * 100);
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email,
        amount: pesewas,
        currency: 'GHS',
        ref: `ORDER-${orderId}-${Date.now()}`,
        metadata: { orderId },
        callback: () => onSuccess(),
        onClose: () => { setIsLoading(false); onClose(); },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading || !publicKey} className="w-full bg-green-600 hover:bg-green-700">
      {isLoading ? 'Processing...' : '💳 Pay Now'}
    </Button>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    region: '',
    city: '',
    area: '',
    postalCode: '',
    country: 'Ghana',
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
    if (!address.area) newErrors.area = 'Select area';
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    const orderData = {
      orderItems: items.map(item => ({ product: item.productId, qty: item.qty, size: item.size, color: item.color })),
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.region,
        area: address.area,
        postalCode: address.postalCode,
        country: 'Ghana',
      },
      paymentMethod: 'paystack',
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
    };
    const { data } = await axios.post('/orders', orderData);
    return data.data;
  };

  const handleAddressSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateAddress()) setStep(2); };
  
  const handlePaystackFlow = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      setCreatedOrderId(order._id);
    } catch (err: any) { 
      alert(err.response?.data?.message || 'Order creation failed'); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const onPaystackSuccess = async () => {
    try {
      await axios.put(`/orders/${createdOrderId}/pay`, { status: 'completed' });
    } catch (err) { 
      console.error('Failed to update payment status', err); 
    }
    window.location.href = '/orders?payment=success';
  };
  
  const onPaystackClose = () => setCreatedOrderId(null);

  const updateAddress = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'region') setAddress(prev => ({ ...prev, region: value, city: '', area: '' }));
    if (field === 'city') setAddress(prev => ({ ...prev, city: value, area: '' }));
  };

  const availableCities = address.region ? getCities(address.region) : [];
  const availableAreas = (address.region && address.city) ? getAreas(address.region, address.city) : [];

  if (items.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Step indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[1, 2, 3].map(i => (
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
                    <div>
                      <Label>Full name</Label>
                      <Input value={address.fullName} onChange={e => updateAddress('fullName', e.target.value)} className="mt-1" />
                      {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label>Phone number</Label>
                      <Input type="tel" value={address.phone} onChange={e => updateAddress('phone', e.target.value)} className="mt-1" />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Street address</Label>
                    <Input value={address.addressLine1} onChange={e => updateAddress('addressLine1', e.target.value)} className="mt-1" />
                    {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <Label>Region</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.region} onChange={e => updateAddress('region', e.target.value)}>
                        <option value="">Select region</option>
                        {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors.region && <p className="text-red-500 text-xs">{errors.region}</p>}
                    </div>
                    <div>
                      <Label>City / Town</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.city} onChange={e => updateAddress('city', e.target.value)} disabled={!address.region}>
                        <option value="">Select city</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div>
                      <Label>Area / District</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.area} onChange={e => updateAddress('area', e.target.value)} disabled={!address.city}>
                        <option value="">Select area</option>
                        {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {errors.area && <p className="text-red-500 text-xs">{errors.area}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label>Postal code</Label>
                      <Input value={address.postalCode} onChange={e => updateAddress('postalCode', e.target.value)} className="mt-1" />
                      {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input value="Ghana" disabled className="mt-1 bg-gray-100" />
                    </div>
                  </div>
                  <Button type="submit" className="bg-primary w-full md:w-auto">Continue to payment <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </form>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Payment Method</h2>
                <div className="border rounded-xl p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="font-medium">Card Payment (Paystack)</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-7">Secure online payment with card, mobile money, or bank transfer</p>
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                  <Button onClick={() => setStep(3)} className="bg-primary">Review order <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Review your order</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2"><h3 className="font-semibold">Shipping address</h3><button onClick={() => setStep(1)} className="text-primary text-sm">Edit</button></div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">
                      {address.fullName}<br />
                      {address.addressLine1}<br />
                      {address.area}, {address.city}, {address.region}<br />
                      {address.postalCode}<br />
                      Phone: {address.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><h3 className="font-semibold">Payment method</h3><button onClick={() => setStep(2)} className="text-primary text-sm">Edit</button></div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">Card Payment (Paystack)</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-600 mb-2"><span>Subtotal</span><span>₵{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 mb-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₵${shipping.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-xl font-bold mt-3 pt-3 border-t"><span>Total</span><span>₵{total.toLocaleString()}</span></div>
                  </div>
                  {!createdOrderId ? (
                    <Button onClick={handlePaystackFlow} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Creating order...' : 'Proceed to payment'}</Button>
                  ) : (
                    <PaystackButton email={user.email} amount={total} orderId={createdOrderId} onSuccess={onPaystackSuccess} onClose={onPaystackClose} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b">Order summary</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.qty}</span>
                    <span className="font-medium">₵{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>₵{total.toLocaleString()}</span></div>
              </div>
            </div>
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
