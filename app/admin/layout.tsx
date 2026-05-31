'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, isLoading } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Fetch user if not already loaded
      if (!user) {
        await fetchMe();
      }
      setChecking(false);
    };
    checkAuth();
  }, [fetchMe, user]);

  useEffect(() => {
    if (!checking) {
      if (!user) {
        // Not logged in
        router.push('/auth/login?redirect=/admin/dashboard');
      } else if (user.role !== 'admin') {
        // Logged in but not admin
        router.push('/');
      }
    }
  }, [user, checking, router]);

  // Show loading while checking
  if (checking || isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Only render if admin
  if (user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-lg border-b text-primary">Admin Panel</div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
            <Package className="h-4 w-4" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <button onClick={() => useAuthStore.getState().logout()} className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 text-red-600">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
