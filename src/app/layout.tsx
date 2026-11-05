import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
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
  metadataBase: new URL('https://studiospacelive.netlify.app'),
  title: {
    default: 'StudioSpace - Creative Workspace & Production Studio Sharing',
    template: '%s | StudioSpace',
  },
  description:
    'Discover and reserve photography stages, soundstages, podcast lounges, music suites, and creative artisan workshops with real-time availability and transparent hourly pricing.',
  keywords: [
    'studio rental',
    'photography studio',
    'soundstage',
    'podcast studio',
    'music recording',
    'production space',
    'creative studio sharing',
  ],
  authors: [{ name: 'StudioSpace Team' }],
  creator: 'StudioSpace',
  publisher: 'StudioSpace',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'StudioSpace - Creative Workspace & Production Studio Sharing',
    description:
      'Discover and reserve photography stages, soundstages, podcast lounges, music suites, and creative artisan workshops with real-time availability and transparent hourly pricing.',
    url: 'https://studiospacelive.netlify.app',
    siteName: 'StudioSpace',
    images: [
      {
        url: '/Isometric%20Photography%20Studio%20Diorama.png',
        width: 1200,
        height: 800,
        alt: 'StudioSpace Creative Workspaces',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioSpace - Creative Workspace & Production Studio Sharing',
    description:
      'Discover and reserve photography stages, soundstages, podcast lounges, music suites, and creative artisan workshops with real-time availability and transparent hourly pricing.',
    images: ['/Isometric%20Photography%20Studio%20Diorama.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
            <Toaster position="bottom-right" richColors closeButton />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
          id="google-gsi-client"
        />
      </body>
    </html>
  );
}
