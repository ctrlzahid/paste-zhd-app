import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full border-t bg-background/50 backdrop-blur-sm'>
      <div className='container flex h-14 items-center justify-between max-w-4xl mx-auto px-4'>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} paste.zhd.app
        </p>
        <nav className='flex items-center gap-4'>
          <Link
            href='/privacy'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Privacy Policy
          </Link>
          <Link
            href='/terms'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
