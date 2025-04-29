import { Space_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'paste.zhd.app',
  description: 'A simple, fast, and secure pastebin service',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='alternate icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <meta name='theme-color' content='#18181B' />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          spaceMono.className
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          storageKey='paste-theme'
          disableTransitionOnChange
        >
          <div className='relative flex min-h-screen flex-col'>
            <Header />
            {children}
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
