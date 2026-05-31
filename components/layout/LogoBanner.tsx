'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LogoBanner() {
  return (
    <div className="bg-white border-b border-gray-200 py-2 shadow-sm">
      <div className="container mx-auto px-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Replace with your actual logo image */}
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"  // Place your logo in /public/logo.png
              alt="Wilder's Corner"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-800">Wilder's Corner</span>
        </Link>
      </div>
    </div>
  );
}
