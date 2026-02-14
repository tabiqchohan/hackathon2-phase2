'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
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
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <SignUpForm onError={setError} />

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
}