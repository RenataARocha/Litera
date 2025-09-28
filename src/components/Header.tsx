'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaBookOpen, FaChartLine, FaPlus, FaBars, FaTimes, FaBook, FaMoon, FaSun } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <FaChartLine /> },
    { href: '/books', label: 'Biblioteca', icon: <FaBook /> },
    { href: '/leituras-atuais', label: 'Leituras Atuais', icon: <FaBookOpen /> }
  ];

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 glass-morphism dark:bg-gray-900/70 dark:backdrop-blur-md">
      {/* Container principal - responsivo */}
      <div
        className="max-w-7xl mx-auto"
        style={{
          paddingLeft: '2rem',
          paddingRight: '1rem'
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ height: '4.5rem' }}
        >

          {/* Logo - compacto */}
          <div
            className="flex items-center"
            style={{ gap: '0.5rem' }}
          >
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg  animate-glow">
                <FaBookOpen className="text-white text-sm lg:text-lg" />
              </div>
              <div
                className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse"
                style={{
                  top: '-0.125rem',
                  right: '-0.125rem'
                }}
              ></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg lg:text-xl font-bold text-gradient">Litera</h1>
              <p
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{ lineHeight: '1.3' }}
              >
                Biblioteca Digital
              </p>
            </div>
            {/* Logo mobile mais compacto */}
            <div className="lg:hidden">
              <h1 className="text-lg font-bold text-gradient">Litera</h1>
            </div>
          </div>

          {/* Menu Desktop - mais compacto */}
          <nav
            className="hidden lg:flex items-center"
            style={{ gap: '0.25rem' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800 hover:shadow-md group"
                style={{
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <span className="group-hover:animate-bounce-subtle text-sm">
                  {link.icon}
                </span>
                <span className="hidden xl:inline">{link.label}</span>
              </Link>
            ))}

            {/* Divisor */}
            <div
              className="w-px h-6 bg-white/30 dark:bg-gray-700"
              style={{
                marginLeft: '0.5rem',
                marginRight: '0.5rem'
              }}
            ></div>

            {/* Botão Novo Livro */}
            <Link
              href="/books/new"
              className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                gap: '0.5rem',
                padding: '0.5rem 0.75rem'
              }}
            >
              <FaPlus className="text-xs" />
              <span className="hidden xl:inline">Novo Livro</span>
            </Link>

            {/* Botão Tema */}
            <button
              onClick={toggleTheme}
              className="rounded-lg transition-colors duration-200 hover:bg-white/50 dark:hover:bg-gray-800"
              style={{ padding: '0.5rem' }}
              aria-label="Alterar tema"
            >
              {mounted ? (
                resolvedTheme === 'light' ?
                  <FaMoon className="text-gray-700 text-sm" /> :
                  <FaSun className="text-yellow-400 text-sm" />
              ) : null}
            </button>
          </nav>

          {/* Menu Mobile - compacto */}
          <div
            className="flex items-center lg:hidden"
            style={{ gap: '0.5rem' }}
          >
            {/* Botão tema mobile */}
            <button
              onClick={toggleTheme}
              className="rounded-lg transition-colors duration-200 hover:bg-white/50 dark:hover:bg-gray-800"
              style={{ padding: '0.5rem' }}
              aria-label="Alterar tema"
            >
              {mounted ? (
                resolvedTheme === 'light' ?
                  <FaMoon className="text-gray-700 text-sm" /> :
                  <FaSun className="text-yellow-400 text-sm" />
              ) : null}
            </button>

            {/* Botão menu hamburger */}
            <button
              onClick={toggleMenu}
              className="rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
              style={{ padding: '0.5rem' }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ?
                <FaTimes className="text-gray-700 dark:text-gray-200 text-lg" /> :
                <FaBars className="text-gray-700 dark:text-gray-200 text-lg" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="lg:hidden glass-morphism border-t border-white/20 dark:border-gray-700 animate-slide-down"
        >
          <div
            className="space-y-1"
            style={{
              padding: '0.75rem 1rem'
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200"
                style={{
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <span className="text-sm">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}

            {/* Botão Novo Livro mobile */}
            <Link
              href="/books/new"
              onClick={() => setMenuOpen(false)}
              className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg transition-all duration-200"
              style={{
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                marginTop: '0.5rem'
              }}
            >
              <FaPlus className="text-sm" />
              <span className="text-sm font-medium">Novo Livro</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}