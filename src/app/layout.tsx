import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '../components/Header';

export const metadata: Metadata = {
    title: 'Litera - Gerenciamento de Livros',
    description: 'Sua biblioteca digital pessoal.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='pt-br'>
            <body className='min-h-screen antialiased custom-scrollbar'>
                <div className='flex flex-col min-h-screen'>
                    <Header />
                    <main className='flex-1 container mx-auto px-4 py-8 mt-4'>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}