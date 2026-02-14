'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SignUpFormProps {
  onError: (error: string | null) => void;
}

export default function SignUpForm({ onError }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError(null);

    try {
      await register(email, password, name);
    } catch (err) {
      console.error('Signup error:', err);
      onError('Failed to create account. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" defaultValue="true" />
      <div className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
}