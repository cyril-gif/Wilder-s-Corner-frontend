import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import Navbar from '@/components/layout/Navbar';
import CategoryBar from '@/components/layout/CategoryBar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Wlider's Corner - Quality Shoes, Bags & More",
  description: 'Shop the best deals online',
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <QueryProvider>
          <Navbar />
          <CategoryBar />
          <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
