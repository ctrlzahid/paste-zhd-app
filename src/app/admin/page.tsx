import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - paste.zhd.app',
  description: 'Admin dashboard for paste.zhd.app',
};

export default function AdminPage() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
          <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Link
              href='/admin/analytics'
              className='p-6 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors'
            >
              <h2 className='text-xl font-semibold mb-2'>Analytics</h2>
              <p className='text-muted-foreground'>
                View usage statistics, popular languages, and user activity.
              </p>
            </Link>

            <Link
              href='/admin/login'
              className='p-6 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors'
            >
              <h2 className='text-xl font-semibold mb-2'>Login</h2>
              <p className='text-muted-foreground'>
                Log in with admin credentials to access protected areas.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
