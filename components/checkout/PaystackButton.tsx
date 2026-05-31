'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaystackProps {
  email: string;
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackPayment({ email, amount, orderId, onSuccess, onClose }: PaystackProps) {
  const [isLoading, setIsLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const handlePayment = () => {
    setIsLoading(true);
    
    // Load Paystack script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount * 100, // Paystack uses kobo (multiply by 100)
        ref: `ORDER-${orderId}-${Date.now()}`,
        metadata: {
          orderId: orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId,
            },
          ],
        },
        callback: (response: any) => {
          // Payment successful
          console.log('Payment success:', response);
          setIsLoading(false);
          onSuccess();
        },
        onClose: () => {
          // User closed modal
          console.log('Payment closed');
          setIsLoading(false);
          onClose();
        },
      });
      handler.openIframe();
    };
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      setIsLoading(false);
      alert('Payment service unavailable. Please try again.');
    };
    document.body.appendChild(script);
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading || !publicKey}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
    >
      {isLoading ? 'Loading Paystack...' : '💳 Pay with Card (Paystack)'}
    </Button>
  );
}
