'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { Menu, X, LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, isLoading } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) await fetchMe();
      setChecking(false);
    };
    checkAuth();
  }, [fetchMe, user]);

  useEffect(() => {
    if (!checking) {
      if (!user) router.push('/auth/login?redirect=/admin/dashboard');
      else if (user.role !== 'admin') router.push('/');
    }
  }, [user, checking, router]);

  if (checking || isLoading || !user || user.role !== 'admin') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header with hamburger */}
      <div className="md:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-primary">Admin Panel</h1>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-primary">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar (hidden on mobile) */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white shadow-md z-10">
        <div className="p-4 font-bold text-lg border-b text-primary">Admin Panel</div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
          <button onClick={() => useAuthStore.getState().logout()} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-red-600 w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content – margin left only on desktop */}
      <main className="md:ml-64 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
