import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import CategoryBar from '@/components/layout/CategoryBar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Wilder's Corner - Quality Shoes, Bags & More",
  description: 'Shop the best deals online',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <QueryProvider>
            <Navbar />
            <CategoryBar />
            <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
