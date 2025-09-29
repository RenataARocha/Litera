import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ToasterClient from "@/components/ToasterClient";
import { ThemeProvider } from 'next-themes';

// SEO otimizado para o Litera
export const metadata: Metadata = {
  title: {
    default: 'Litera | Plataforma de Gestão Editorial e Literária',
    template: '%s | Litera'
  },
  description:
    'Plataforma completa para escritores, editores e profissionais do mercado editorial. Gerencie manuscritos, organize projetos literários e conecte-se com a comunidade literária.',
  keywords: [
    'gestão editorial',
    'plataforma literária',
    'manuscritos',
    'escritores',
    'editores',
    'publicação',
    'literatura',
    'livros',
    'projetos literários',
    'gerenciamento de livros',
  ],
  authors: [{ name: 'Litera Team' }],
  creator: 'Litera Team',
  publisher: 'Litera',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://litera-six.vercel.app',
    title: 'Litera | Plataforma de Gestão Editorial e Literária',
    description:
      'Plataforma completa para escritores, editores e profissionais do mercado editorial. Gerencie manuscritos, organize projetos literários e conecte-se com a comunidade literária.',
    siteName: 'Litera',
    images: [
      {
        url: '/images/litera-og.png', // ✅ atualizado
        width: 1200,
        height: 630,
        alt: 'Litera - Plataforma de Gestão Editorial',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Litera | Plataforma de Gestão Editorial e Literária',
    description:
      'Plataforma completa para escritores, editores e profissionais do mercado editorial.',
    images: ['/images/litera-og.png'], // ✅ atualizado
    creator: '@litera_oficial',
    site: '@litera_oficial',
  },

  // Robots
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

  // Verification
  verification: {
    google: 'hXeWeGInBZl0q9WLs_RfAKDC61OR0wfqfAMwdomyPeY',
    yandex: '7ee7cd40629bd063',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#6366f1',
      },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Theme color
  themeColor: '#6366f1',

  // Canonical e Metadata base
  metadataBase: new URL('https://litera-six.vercel.app'),

  // Alternates
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
    },
  },

  // Category
  category: 'technology',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300 dark:bg-[#1e2939]">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-8 mt-4">{children}</main>
            <ToasterClient />
            <ScrollToTopButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
