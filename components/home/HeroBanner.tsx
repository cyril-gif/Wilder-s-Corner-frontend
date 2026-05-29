'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';

const banners = [
  { title: 'Up to 50% Off', subtitle: 'On selected shoes & bags', bg: 'bg-gradient-to-r from-orange-500 to-red-500', link: '/products?discount=true' },
  { title: 'Flash Sale', subtitle: 'Limited time offers', bg: 'bg-gradient-to-r from-blue-500 to-purple-500', link: '/products?isFlashSale=true' },
  { title: 'New Arrivals', subtitle: 'Shop the latest styles', bg: 'bg-gradient-to-r from-green-500 to-teal-500', link: '/products?sort=newest' },
];

export default function HeroBanner() {
  return (
    <Carousel className="w-full mb-8">
      <CarouselContent>
        {banners.map((banner, i) => (
          <CarouselItem key={i}>
            <Link href={banner.link}>
              <div className={`${banner.bg} h-48 md:h-64 rounded-lg flex flex-col items-center justify-center text-white text-center`}>
                <h2 className="text-2xl md:text-4xl font-bold">{banner.title}</h2>
                <p className="text-sm md:text-lg mt-2">{banner.subtitle}</p>
                <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-semibold">Shop Now →</button>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
