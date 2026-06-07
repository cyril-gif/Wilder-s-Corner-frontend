'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google and redirect to the intended page
      await signIn("google", { callbackUrl: redirect });
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-card w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
      >
        Continue with Google
      </Button>
      
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link href={`/auth/register?redirect=${encodeURIComponent(redirect)}`} className="text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoginForm />
      </div>
    </Suspense>
  );
}
