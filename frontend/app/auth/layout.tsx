import { ReactNode } from 'react';
import Card from '@/components/ui/Card';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Todo App</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your tasks efficiently</p>
        </div>
        <Card>
          <Card.Body className="space-y-6">
            {children}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}