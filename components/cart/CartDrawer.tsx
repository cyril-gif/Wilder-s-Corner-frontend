'use client';

import { Drawer } from 'vaul';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <Drawer.Root open={open} onOpenChange={onClose} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Your Cart ({items.length})</h2>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              items.map((item) => (
                <div key={item.productId + (item.size || '') + (item.color || '')} className="flex gap-3 border-b pb-3">
                  <div className="h-20 w-20 bg-gray-100 rounded flex-shrink-0">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">₵{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.qty - 1)} className="border rounded px-2 py-0.5">-</button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.productId, item.qty + 1)} className="border rounded px-2 py-0.5">+</button>
                      <button onClick={() => removeItem(item.productId)} className="ml-auto text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {items.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₵{subtotal.toLocaleString()}</span>
              </div>
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full bg-primary">Proceed to Checkout</Button>
              </Link>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
