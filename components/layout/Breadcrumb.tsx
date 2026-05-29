'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumb on homepage
  if (pathname === '/') return null;
  
  const paths = pathname.split('/').filter(p => p);
  
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-primary flex items-center gap-1">
        <Home className="h-4 w-4" />
        Home
      </Link>
      {paths.map((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const isLast = index === paths.length - 1;
        const displayName = path === 'category' ? '' : 
          path === 'products' ? 'Products' :
          path === 'cart' ? 'Cart' :
          path === 'checkout' ? 'Checkout' :
          path === 'orders' ? 'My Orders' :
          path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        if (path === 'category') return null;
        
        return (
          <div key={href} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="text-gray-900 font-medium">{displayName}</span>
            ) : (
              <Link href={href} className="hover:text-primary">{displayName}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
