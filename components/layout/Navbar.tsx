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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="text-white text-2xl font-bold">Wilder's Corner</Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2 pl-4 pr-10 rounded-full border-0" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2"><Search className="h-5 w-5 text-gray-400" /></button>
          </div>
        </form>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <Button variant="ghost" className="text-white"><User className="h-5 w-5 mr-1" />{user.name.split(' ')[0]}</Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                {user.role === 'admin' && <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin</Link>}
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login"><Button variant="ghost" className="text-white"><User className="h-5 w-5 mr-1" /> Sign In</Button></Link>
          )}
          <Link href="/cart" className="relative text-white">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
