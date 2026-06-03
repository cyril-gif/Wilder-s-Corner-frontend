export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using Wilder's Corner website, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products and Pricing</h2>
        <p className="mb-4">
          We strive to display accurate product descriptions, prices, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
        </p>
        <p className="mb-4">
          Prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Orders and Payments</h2>
        <p className="mb-4">
          By placing an order, you agree to pay the specified price and any applicable taxes or shipping fees. We reserve the right to refuse or cancel any order for any reason.
        </p>
        <p className="mb-4">
          We accept Cash on Delivery and Card payments via Paystack. All payments are processed securely.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Shipping and Delivery</h2>
        <p className="mb-4">
          We ship to addresses within Ghana. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier services or customs.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Returns and Refunds</h2>
        <p className="mb-4">
          We accept returns within 7 days of delivery for defective or incorrect products. Items must be unused and in original packaging. Refunds will be processed within 14 days of receiving the returned item.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Account Responsibility</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, Wilder's Corner shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the updated terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Information</h2>
        <p className="mb-4">
          Questions about these Terms should be sent to:<br />
          Email: <strong>legal@wilderscorner.com</strong><br />
          Phone: <strong>+233 59 504 6967</strong>
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mt-8">
          <p className="text-sm text-gray-600 mb-0">
            By using Wilder's Corner, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

