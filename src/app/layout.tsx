import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

// Metadados para SEO e acessibilidade

export const metadata: Metadata = {
  title: 'Litera',
  description: 'Aplicação para gerenciamento de biblioteca pessoal',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-br'>
      <body className='min-h-screen bg-gray-50 text-gray-900 antialiased'>
        <main className='container mx-auto px-4 py-6'>
          {children}
        </main>
      </body>
    </html>
  )
}