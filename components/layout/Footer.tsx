import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><h3 className="font-bold mb-2">Wilder's Corner</h3><p className="text-sm text-gray-400">Your one-stop shop for quality products</p></div>
          <div><h4 className="font-semibold mb-2">Quick Links</h4><ul className="text-sm space-y-1 text-gray-400"><li><Link href="/about">About Us</Link></li><li><Link href="/contact">Contact</Link></li></ul></div>
          <div><h4 className="font-semibold mb-2">Policy</h4><ul className="text-sm space-y-1 text-gray-400"><li><Link href="/privacy">Privacy Policy</Link></li><li><Link href="/terms">Terms of Service</Link></li></ul></div>
          <div><h4 className="font-semibold mb-2">Contact</h4><p className="text-sm text-gray-400">Email: support@wilderscorner.com</p><p className="text-sm text-gray-400">Phone: +233 27 180 8592</p></div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} Wilder's Corner. All rights reserved.</div>
      </div>
    </footer>
  );
}
