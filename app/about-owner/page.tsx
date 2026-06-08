import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Quote } from 'lucide-react';

export default function AboutOwnerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>
      
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-orange-600 p-8 text-white text-center">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <Image
              src="/owner.jpg"
              alt="Margaret Efia Essien - Founder"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Margaret Efia Essien</h1>
          <p className="text-white/90 mt-1">Founder & CEO of Wilder's Corner</p>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <Quote className="h-8 w-8 text-primary/30 mb-2" />
            <p className="text-gray-700 italic text-lg">
              "I started Wilder's Corner with a simple mission – to make quality products accessible 
              to every Ghanaian, no matter where they live."
            </p>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">My Journey</h2>
              <p>
                Growing up in the Upper West Region, I saw firsthand how hard it was for people to 
                access quality products at fair prices. Many had to travel long distances to regional 
                capitals just to buy basic items like shoes, bags, or hair products.
              </p>
              <p className="mt-3">
                That inspired me to create Wilder's Corner – an online store that brings quality 
                products directly to your doorstep, no matter where you are in Ghana.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
              <p>
                To provide the best online shopping experience in Ghana – offering quality products, 
                secure payments, and fast delivery – all at competitive prices.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Why Wilder's Corner?</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>✅ 100% Authentic Products</li>
                <li>✅ Secure Payment Options (Cash on Delivery & Card)</li>
                <li>✅ Fast Delivery Across Ghana</li>
                <li>✅ 24/7 Customer Support</li>
                <li>✅ Easy Returns & Refunds</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">Contact Me Directly</h3>
              <p className="text-sm">
                Have questions? I personally respond to all customer inquiries within 24 hours.
              </p>
              <div className="mt-3">
                <Link 
                  href="/contact" 
                  className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
