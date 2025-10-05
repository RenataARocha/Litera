'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeWrapperProps {
    children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            themes={['light', 'dark', 'wood']}  // ← ADICIONAR
            value={{                              // ← ADICIONAR
                light: 'light',
                dark: 'dark',
                wood: 'wood'
            }}
        >
            {children}
        </ThemeProvider>
    );
}