// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Litera',
  description: 'Gerenciamento de biblioteca pessoal',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Aqui pode adicionar Header */}
        {children}
        {/* Aqui pode adicionar Footer */}
      </body>
    </html>
  )
}
