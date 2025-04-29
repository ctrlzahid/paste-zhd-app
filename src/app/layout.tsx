import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { scheduleCleanup } from '@/lib/cleanup';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Initialize cleanup service
if (process.env.NODE_ENV === 'production') {
  scheduleCleanup();
}

export const metadata: Metadata = {
  title: 'paste.zhd.app',
  description: 'Share code in a snap',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={spaceMono.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='min-h-screen flex flex-col'>
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
