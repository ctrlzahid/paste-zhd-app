'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleLogout}
      className='text-muted-foreground hover:text-foreground'
    >
      <LogOut className='h-4 w-4 mr-2' />
      Logout
    </Button>
  );
}
