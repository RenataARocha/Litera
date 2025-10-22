// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ToasterClient from "@/components/ToasterClient";
import { ThemeProvider } from 'next-themes';

const SITE_URL = 'https://litera-biblioteca-online.vercel.app';
const OG_IMAGE_URL = `${SITE_URL}/images/litera-og.png`;

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

  // Metadata base
  metadataBase: new URL(SITE_URL),

  // Open Graph - CORRIGIDO
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    title: 'Litera | Plataforma de Gestão Editorial e Literária',
    description:
      'Plataforma completa para escritores, editores e profissionais do mercado editorial. Gerencie manuscritos, organize projetos literários e conecte-se com a comunidade literária.',
    siteName: 'Litera',
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL, // Adicione secureUrl explicitamente
        width: 1200,
        height: 630,
        alt: 'Litera - Plataforma de Gestão Editorial',
        type: 'image/png',
      },
    ],
  },

  // Twitter - CORRIGIDO
  twitter: {
    card: 'summary_large_image',
    title: 'Litera | Plataforma de Gestão Editorial e Literária',
    description:
      'Plataforma completa para escritores, editores e profissionais do mercado editorial.',
    images: [OG_IMAGE_URL],
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Meta tags adicionais para forçar Open Graph */}
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:secure_url" content={OG_IMAGE_URL} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Litera - Plataforma de Gestão Editorial" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Litera",
              "description": "Plataforma completa para gestão editorial e literária",
              "url": SITE_URL,
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Litera",
                "url": SITE_URL,
                "logo": {
                  "@type": "ImageObject",
                  "url": OG_IMAGE_URL,
                  "caption": "Logo oficial do Litera"
                }
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Escritores, Editores, Profissionais do mercado editorial"
              },
              "featureList": [
                "Gestão de manuscritos",
                "Organização de projetos literários",
                "Colaboração em tempo real",
                "Controle de versões",
                "Biblioteca digital pessoal"
              ]
            })
          }}
        />

        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </head>
      <body
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={["light", "dark", "wood"]}
        >
          <div className="flex flex-col min-h-screen bg-blue-100/60 dark:bg-slate-900 wood:bg-background">
            <Header />
            <main className="flex-1 py-8 mt-4">{children}</main>
            <ToasterClient />
            <ScrollToTopButton />
            <footer
              className="
    text-center text-sm
    text-gray-600 dark:text-blue-200 wood:text-secondary-200
    border-t border-gray-300 dark:border-blue-700 wood:border-secondary-600
    bg-transparent
  "
              style={{ marginTop: "2rem", padding: "1rem 0" }}
            >
              <p>
                Desenvolvido pelo grupo{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400 wood:text-secondary-100">
                  &lt;Dev 10/&gt;
                </span>
              </p>
              <p
                className="
      text-xs text-gray-500 dark:text-blue-300 wood:text-secondary-300
    "
                style={{ marginTop: "0.3rem" }}
              >
                © 2024 Litera. Todos os direitos reservados.
              </p>
            </footer>
          </div>
        </ThemeProvider>

        {/* PONTO CRÍTICO: Raiz para Modais (React Portals) */}
        <div id="modal-root" />
      </body>
    </html>
  );
}