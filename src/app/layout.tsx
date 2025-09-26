import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { ThemeProvider } from 'next-themes';
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Litera - Gerenciamento de Livros',
  description: 'Sua biblioteca digital pessoal.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <html lang="pt-br" suppressHydrationWarning>
        <body className="min-h-screen transition-colors duration-300">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-8 mt-4">{children}</main>
            <Toaster richColors position="top-right" />
            <ScrollToTopButton />
          </div>
        </body>
      </html>
    </ThemeProvider>
  );
}

