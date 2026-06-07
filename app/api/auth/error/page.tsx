'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error starting Google sign in. Please try again.';
      case 'OAuthCallback':
        return 'Error completing Google sign in. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create account. Please try a different method.';
      case 'AccessDenied':
        return 'Access denied. Please check your Google account permissions.';
      default:
        return `Authentication failed: ${error || 'Unknown error'}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{getErrorMessage()}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login" className="bg-primary text-white px-4 py-2 rounded">
            Back to Login
          </Link>
          <Link href="/" className="border px-4 py-2 rounded">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
