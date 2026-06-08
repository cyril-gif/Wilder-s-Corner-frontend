'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function CallbackContent() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Get the stored redirect URL
      const redirectUrl = sessionStorage.getItem('postLoginRedirect') || '/';
      sessionStorage.removeItem('postLoginRedirect');
      router.push(redirectUrl);
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
