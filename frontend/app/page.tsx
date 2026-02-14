'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/signin');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" label="Redirecting..." />
      </div>
    </div>
  );
}