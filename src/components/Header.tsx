'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaBookOpen, FaChartLine, FaPlus, FaBars, FaTimes, FaBook, FaMoon, FaSun } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch: só mostramos o ícone dependente do tema depois que o componente monta no client
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <FaChartLine /> },
    { href: '/books', label: 'Biblioteca', icon: <FaBook /> },
  ];

  return (
    <header className="sticky top-0 z-50 glass-morphism dark:bg-gray-900/70 dark:backdrop-blur-md">
      {/* Container com estilos forçados */}
      <div
        className="max-w-7xl mx-auto"
        style={{
          paddingLeft: '2rem',
          paddingRight: '2rem'
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ height: '4.5rem' }}
        >
          {/* Logotipo e título */}
          <div className="flex items-center" style={{ gap: '1rem' }}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                <FaBookOpen className="text-white text-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Litera</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Biblioteca Digital</p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="desktop-only flex items-center" style={{ gap: '0.5rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800 hover:shadow-md group"
                style={{
                  padding: '0.75rem 1.5rem',
                  minWidth: 'fit-content'
                }}
              >
                <span className="group-hover:animate-bounce-subtle" style={{ marginRight: '0.75rem' }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}

            {/* Divisor */}
            <div
              className="bg-white/30 dark:bg-gray-700"
              style={{
                width: '1px',
                height: '2rem',
                margin: '0 1rem'
              }}
            ></div>

            {/* Botão Novo Livro */}
            <Link
              href="/books/new"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
              style={{
                padding: '0.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <FaPlus />
              Novo Livro
            </Link>

            {/* Botão Alterar Tema */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl transition-colors duration-200 hover:bg-white/50 dark:hover:bg-gray-800"
              style={{ padding: '0.75rem' }}
              aria-label="Alterar tema"
            >
              {/* só renderiza o ícone depois do mount para evitar hydration mismatch */}
              {mounted ? (
                resolvedTheme === 'light' ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />
              ) : null}
            </button>
          </nav>

          {/* Botão do Menu Mobile */}
          <div className="mobile-only">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl hover:bg-white/50 transition-colors"
              style={{ padding: '0.75rem' }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ?
                <FaTimes className="text-gray-700 text-xl" /> :
                <FaBars className="text-gray-700 text-xl" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="mobile-only glass-morphism border-t border-white/20 dark:border-gray-700 animate-slide-down"
        >
          <div
            className="space-y-3"
            style={{
              padding: '1.5rem 2rem'
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center w-full text-left rounded-xl hover:bg-white/50 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200"
                style={{
                  padding: '1rem 1.25rem',
                  gap: '1rem'
                }}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-base">{link.label}</span>
              </Link>
            ))}

            {/* Botão Novo Livro no mobile */}
            <Link
              href="/books/new"
              onClick={() => setMenuOpen(false)}
              className="flex items-center w-full text-left bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                padding: '1rem 1.25rem',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              <FaPlus className="text-lg" />
              <span className="text-base font-medium">Novo Livro</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
