import HeroBanner from '@/components/home/HeroBanner';
import ProductGrid from '@/components/products/ProductGrid';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      
      {/* Flash Sales Section */}
      <ProductGrid 
        title="⚡ Flash Sales" 
        filter={{ isFlashSale: true, limit: 8 }} 
        limit={8} 
      />
      
      {/* Featured Products Section */}
      <ProductGrid 
        title="⭐ Featured Products" 
        filter={{ isFeatured: true, limit: 8 }} 
        limit={8} 
      />
      
      {/* New Arrivals Section */}
      <ProductGrid 
        title="🆕 New Arrivals" 
        filter={{ sort: '-createdAt', limit: 8 }} 
        limit={8} 
      />
      
      {/* Recommended for You (optional) */}
      <ProductGrid 
        title="🔥 Recommended for You" 
        filter={{ sort: '-sold', limit: 8 }} 
        limit={8} 
      />
    </>
  );
}

