'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SignInFormProps {
  onError: (error: string | null) => void;
}

export default function SignInForm({ onError }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError(null);

    try {
      await login(email, password);
    } catch (err) {
      console.error('Signin error:', err);
      onError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" defaultValue="true" />
      <div className="space-y-4">
        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}