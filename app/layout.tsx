import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import AuthProvider from '@/components/Providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import CategoryBar from '@/components/layout/CategoryBar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Wilder's Corner - Quality Shoes, Bags & More",
  description: 'Shop the best deals online in Ghana',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#F68B1E" />
      </head>
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
