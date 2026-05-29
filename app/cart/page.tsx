'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link href="/products">
          <Button className="bg-primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.productId + (item.size || '') + (item.color || '')} className="bg-white p-4 rounded-lg shadow-card flex gap-4">
              <div className="h-24 w-24 bg-gray-100 rounded flex-shrink-0 relative">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                <p className="text-primary font-semibold">${item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.productId, item.qty - 1)} className="border rounded p-1"><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQuantity(item.productId, item.qty + 1)} className="border rounded p-1"><Plus className="h-3 w-3" /></button>
                  <button onClick={() => removeItem(item.productId)} className="ml-4 text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <Link href="/products" className="inline-flex items-center text-primary hover:underline mt-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white p-4 rounded-lg shadow-card">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-4 bg-primary">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
