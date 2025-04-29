'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Monitor, Moon, Sun, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    // During initial server-side render, return a default
    if (!mounted) return <Monitor className='h-4 w-4' />;

    if (theme === 'dark') {
      return <Moon className='h-4 w-4' />;
    } else if (theme === 'light') {
      return <Sun className='h-4 w-4' />;
    } else {
      return <Monitor className='h-4 w-4' />;
    }
  };

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex justify-center w-full px-4'>
        <div className='flex h-14 w-full max-w-4xl items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className={`${spaceMono.className} relative`}>
              <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70'>
                paste.zhd.app
              </span>
              <div className='absolute -top-1 -right-12 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider'>
                Beta
              </div>
            </div>
          </Link>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={cycleTheme}
              className='h-9 w-9'
              aria-label='Toggle theme'
            >
              {getThemeIcon()}
            </Button>

            <Button variant='ghost' size='icon' className='h-9 w-9' asChild>
              <a
                href='mailto:ctrlzahid@gmail.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Contact me'
              >
                <Mail className='h-4 w-4' />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
