'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Package, ShoppingBag, Truck, User, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { Drawer } from 'vaul';
import useAuthStore from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';

// Static fallback in case API fails
const staticCategories = [
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Belts', slug: 'belts' },
  { name: 'Hair Creams', slug: 'hair-creams' },
  { name: 'Jewellery', slug: 'jewellery' },
  { name: 'Bags', slug: 'bags' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.length ? categoriesData : staticCategories;

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Shop All', icon: Package },
    { href: '/products?isFlashSale=true', label: 'Flash Sales', icon: ShoppingBag },
    { href: '/track-order', label: 'Track Order', icon: Truck },
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
        <Drawer.Content className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-white p-4 outline-none">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-primary">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
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

            {/* Shop dropdown (categories) */}
            <div>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center justify-between w-full text-gray-700 hover:text-primary py-2"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shop by Category</span>
                </div>
                {shopOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {shopOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm text-gray-600 hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
