'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthSignin':
        return 'There was an error signing in with the provider. Please try again.';
      case 'OAuthCallback':
        return 'There was an error processing your sign in. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create an account. Please try a different method.';
      case 'EmailCreateAccount':
        return 'Could not create an account with this email.';
      case 'Callback':
        return 'There was an error during sign in. Please try again.';
      case 'Default':
        return 'An unexpected error occurred. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{getErrorMessage()}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button className="bg-primary">Back to Login</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
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

