'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Call the auth API
      const response = await fetch('/api/admin/auth');

      if (response.ok) {
        // Redirect to the analytics page
        router.push('/admin/analytics');
      } else {
        console.error('Login failed:', response.statusText);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className='py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-center w-full'
    >
      {isLoading ? 'Logging in...' : 'Login as Admin'}
    </button>
  );
}
