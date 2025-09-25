import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton"; 
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Litera - Gerenciamento de Livros',
  description: 'Sua biblioteca digital pessoal.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black min-h-screen transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-1 py-8 mt-4">
              {children}
            </main>

            <ScrollToTopButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
