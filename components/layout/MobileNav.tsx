'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Home, Package, ShoppingBag, Truck, User, LogOut, BookOpen } from 'lucide-react';
import { Drawer } from 'vaul';
import useAuthStore from '@/store/authStore';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Shop All', icon: Package },
    { href: '/products?isFlashSale=true', label: 'Flash Sales', icon: ShoppingBag },
    { href: '/track-order', label: 'Track Order', icon: Truck },
    { href: '/about-owner', label: "Founder's Story", icon: BookOpen },
  ];

  return (
    <Drawer.Root direction="left" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="text-white p-1 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed top-0 bottom-0 left-0 z-50 w-80 bg-white p-4 outline-none overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-primary">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Owner Profile Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-orange-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src="/owner.jpg"
                  alt="Pascal Lantam Gbate - Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Pascal Lantam Gbate</h3>
                <p className="text-xs text-gray-500">Founder & CEO</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Passionate about bringing quality products to Ghana at affordable prices.
            </p>
            <Link 
              href="/about-owner" 
              onClick={() => setOpen(false)}
              className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              Read full story →
            </Link>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="border-t my-2 pt-2">
              {user ? (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
                  >
                    <Package className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
                    >
                      <User className="h-5 w-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 py-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
