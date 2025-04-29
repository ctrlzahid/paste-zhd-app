import { Metadata } from 'next';
import LoginButton from '@/components/LoginButton';

export const metadata: Metadata = {
  title: 'Admin Login - paste.zhd.app',
  description: 'Login to access the admin analytics dashboard',
};

export default function AdminLoginPage() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95 flex items-center justify-center'>
      <div className='container max-w-md px-4 py-12'>
        <div className='backdrop-blur-sm bg-card/50 border rounded-xl shadow-lg p-6'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold'>Admin Login</h1>
            <p className='text-muted-foreground'>
              Login to access the analytics dashboard
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <p className='text-center text-muted-foreground'>
              Click the button below to log in with the default credentials.
            </p>
            <LoginButton />
            <p className='text-xs text-center text-muted-foreground mt-4'>
              For production use, set the ADMIN_PASSWORD environment variable in
              your .env.local file.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
