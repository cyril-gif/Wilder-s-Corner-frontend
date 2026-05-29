'use client';

import { Star, Truck, Shield, Clock, Award, Heart, Zap, CheckCircle, Sparkles } from 'lucide-react';

const scrollingText = [
  { icon: Award, text: "🏆 Ghana's #1 Trusted Online Store" },
  { icon: Truck, text: "🚚 FREE Delivery on Orders Over $5,000" },
  { icon: Shield, text: "🔒 100% Secure Payments" },
  { icon: Clock, text: "⏰ 24/7 Customer Support" },
  { icon: Zap, text: "⚡ Flash Sales Up to 50% OFF" },
  { icon: Heart, text: "❤️ 10,000+ Happy Customers" },
  { icon: CheckCircle, text: "✅ Quality Products Guaranteed" },
  { icon: Sparkles, text: "⭐ Rated 4.9/5 Stars" },
];

export default function MarqueeBanner() {
  // Duplicate array for seamless loop
  const duplicatedText = [...scrollingText, ...scrollingText];

  return (
    <div className="my-10">
      <div className="relative bg-gradient-to-r from-gray-900 to-primary rounded-xl overflow-hidden shadow-2xl">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse"></div>
        
        {/* Scrolling Content */}
        <div className="overflow-hidden py-5 md:py-6">
          <div className="animate-scroll whitespace-nowrap flex items-center">
            {duplicatedText.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-3 mx-8 text-white"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-base md:text-lg font-semibold">
                    {item.text}
                  </span>
                  <span className="text-white/40 text-2xl">•</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Gradient Overlays for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent"></div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
          display: inline-flex;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

