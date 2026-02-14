'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>

      <SignInForm onError={setError} />

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
}