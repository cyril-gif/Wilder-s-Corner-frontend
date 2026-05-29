'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    } else if (!user) {
      router.push('/auth/login?redirect=/admin/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-lg border-b">Admin Panel</div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-100">Products</Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-100">Orders</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
