export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-lg max-w-none">
        <p className="mb-4">
          At Wilder's Corner, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we look after your personal data when you visit our website and tell you about your privacy rights.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Identity Data</strong> – name, username, or similar identifier</li>
          <li><strong>Contact Data</strong> – email address, phone number, shipping address</li>
          <li><strong>Transaction Data</strong> – details about payments to and from you</li>
          <li><strong>Technical Data</strong> – IP address, browser type, device information</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use your personal data to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Process and deliver your orders</li>
          <li>Manage your account</li>
          <li>Communicate with you about your orders</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Security</h2>
        <p className="mb-4">
          All payment transactions are encrypted and processed through secure payment gateways (Paystack). We do not store your credit card details on our servers.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal data. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us at <strong>privacy@wilderscorner.com</strong>.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy, please contact us at:<br />
          Email: <strong>privacy@wilderscorner.com</strong><br />
          Phone: <strong>+233 59 504 6967</strong>
        </p>
      </div>
    </div>
  );
}

