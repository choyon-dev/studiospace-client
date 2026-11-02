import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'StudioSpace — Creative Workspace & Production Studio Sharing',
  description:
    'Discover and reserve photography stages, soundstages, podcast lounges, music suites, and creative artisan workshops with real-time availability and transparent hourly pricing.',
  keywords: [
    'studio rental',
    'photography studio',
    'soundstage',
    'podcast studio',
    'music recording',
    'production space',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${plusJakartaSans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-zinc-950"
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <Toaster position="top-right" richColors closeButton />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
