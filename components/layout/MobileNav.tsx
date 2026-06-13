'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Home, Package, ShoppingBag, Truck, User, LogOut, BookOpen, Grid3X3, ChevronRight, ChevronDown } from 'lucide-react';
import { Drawer } from 'vaul';
import useAuthStore from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';

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
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary bg-gray-200 flex items-center justify-center">
                <Image
                  src="/owner.jpg"
                  alt="Margaret Efia Essien - Founder"
                  width={56}
                  height={56}
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Margaret Efia Essien</h3>
                <p className="text-xs text-gray-500">Founder & CEO</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Passionate about bringing quality products to Ghana at affordable prices.
            </p>
          </div>
          
          <nav className="space-y-2">
            {/* 1. Home */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {/* 2. Shop All */}
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
            >
              <Package className="h-5 w-5" />
              <span>Shop All</span>
            </Link>

            {/* 3. Shop by Category Dropdown */}
            <div>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center justify-between w-full text-gray-700 hover:text-primary py-2"
              >
                <div className="flex items-center gap-3">
                  <Grid3X3 className="h-5 w-5" />
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

            {/* 4. Flash Sales */}
            <Link
              href="/products?isFlashSale=true"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Flash Sales</span>
            </Link>

            {/* 5. Sign In / User Menu */}
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

            {/* 6. Founder's Story */}
            <div className="border-t pt-2 mt-2">
              <Link
                href="/about-owner"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:text-primary py-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Founder's Story</span>
              </Link>
            </div>
          </nav>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
