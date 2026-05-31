'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const router = useRouter();
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="px-3 py-2">
        {/* Top row: Logo, search, icons */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo - always visible, no truncation */}
          <Link href="/" className="text-white font-bold text-base sm:text-lg whitespace-nowrap shrink-0">
            Wilder's Corner
          </Link>

          {/* Search bar - flexible but with max width */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[180px] sm:max-w-md">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-1.5 pl-2 pr-7 rounded-full text-sm bg-white/90 border-0 placeholder:text-xs"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </div>
          </form>

          {/* Icons - always on right */}
          <div className="flex items-center gap-1 shrink-0">
            {user ? (
              <div className="relative">
                <button className="text-white p-1">
                  <User className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-white px-2">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/cart" className="relative text-white p-1">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
