'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful');
        router.push('/admin/analytics');
      } else {
        setError(data.error || 'Invalid credentials');
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='username'>Username</Label>
        <Input
          id='username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='admin'
          required
          disabled={isLoading}
          autoComplete='username'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter admin password'
          required
          disabled={isLoading}
          autoComplete='current-password'
        />
      </div>

      {error && (
        <p className='text-sm text-red-500 dark:text-red-400'>{error}</p>
      )}

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          <span className='flex items-center gap-2'>
            <div className='size-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
