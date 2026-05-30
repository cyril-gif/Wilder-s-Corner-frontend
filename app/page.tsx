import HeroBanner from '@/components/home/HeroBanner';
import ProductGrid from '@/components/products/ProductGrid';
import MarqueeBanner from '@/components/home/MarqueeBanner';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      
      <ProductGrid title="⚡ Flash Sales" filter={{ isFlashSale: true, limit: 8 }} limit={8} />
      
      <ProductGrid title="🆕 New Arrivals" filter={{ sort: '-createdAt', limit: 8 }} limit={8} />
      
      {/* Professional Animated Banner */}
      <MarqueeBanner />
      
      <ProductGrid title="⭐ Featured Products" filter={{ isFeatured: true, limit: 8 }} limit={8} />

      {/* Professional Animated Banner */}
      <MarqueeBanner />
      
      <ProductGrid title="🔥 Best Sellers" filter={{ sort: '-sold', limit: 8 }} limit={8} />
    </>
  );
}

