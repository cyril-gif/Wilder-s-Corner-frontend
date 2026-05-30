'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar - Black */}
      <div className="bg-gray-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span>📞 +233 123 456 789</span>
            <span>✉️ support@wilderscorner.com</span>
          </div>
          <div className="flex gap-6">
            <Link href="/track-order" className="hover:text-primary">Track Order</Link>
            <Link href="/help" className="hover:text-primary">Help Center</Link>
            {user && user.role === 'admin' && (
              <Link href="/admin/dashboard" className="hover:text-primary">Admin Panel</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:inline">
                Wilder's <span className="text-primary">Corner</span>
              </span>
            </Link>

            {/* Search Bar - Hidden on mobile (shows in mobile menu) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2.5 pl-4 pr-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-md">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Link href="/wishlist" className="hidden md:flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-500">Wishlist</span>
              </Link>

              {/* Account */}
              {user ? (
                <div className="relative group">
                  <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-xs text-gray-500 hidden md:block">Account</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50 border">
                    <div className="p-3 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">My Orders</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile Settings</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-xs text-gray-500 hidden md:block">Sign In</span>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-500 hidden md:block">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-100 border-0"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50 py-4 px-4">
              <div className="flex flex-col space-y-3">
                <Link href="/products" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                <Link href="/category/shoes" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Shoes</Link>
                <Link href="/category/belts" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Belts</Link>
                <Link href="/category/hair-creams" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Hair Creams</Link>
                <Link href="/category/jewellery" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Jewellery</Link>
                <Link href="/category/bags" className="py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Bags</Link>
                <div className="border-t pt-3 mt-2">
                  <Link href="/wishlist" className="py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  {!user && (
                    <Link href="/auth/login" className="py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" /> Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Category Bar - Secondary Navigation */}
      <div className="bg-gray-100 border-b border-gray-200 sticky top-[73px] md:top-[81px] z-40 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 py-3 overflow-x-auto whitespace-nowrap">
            <Link href="/products" className="text-gray-700 hover:text-primary font-medium text-sm">All Products</Link>
            <Link href="/category/shoes" className="text-gray-700 hover:text-primary text-sm">👟 Shoes</Link>
            <Link href="/category/belts" className="text-gray-700 hover:text-primary text-sm">🔗 Belts</Link>
            <Link href="/category/hair-creams" className="text-gray-700 hover:text-primary text-sm">💇 Hair Creams</Link>
            <Link href="/category/jewellery" className="text-gray-700 hover:text-primary text-sm">💍 Jewellery</Link>
            <Link href="/category/bags" className="text-gray-700 hover:text-primary text-sm">👜 Bags</Link>
            <Link href="/products?isFlashSale=true" className="text-red-500 hover:text-red-600 font-medium text-sm">⚡ Flash Sales</Link>
            <Link href="/products?sort=-createdAt" className="text-gray-700 hover:text-primary text-sm">🆕 New Arrivals</Link>
          </div>
        </div>
      </div>
    </>
  );
}