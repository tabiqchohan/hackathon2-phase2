'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Todo App
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.name || user.email.split('@')[0]}</span>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}