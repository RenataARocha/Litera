'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  FaBookOpen,
  FaChartLine,
  FaPlus,
  FaBars,
  FaTimes,
  FaBook,
  FaMoon,
  FaSun,
  FaSignInAlt
} from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <FaChartLine />, protected: false },
    { href: '/books', label: 'Biblioteca', icon: <FaBook />, protected: false },
    { href: '/leituras-atuais', label: 'Leituras Atuais', icon: <FaBookOpen />, protected: true }
  ];

  const toggleTheme = () => {
    if (!mounted) return;

    // Lógica do ciclo de temas: light -> dark -> wood -> light
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else if (resolvedTheme === "dark") {
      setTheme("wood");
    } else { // 'wood' ou fallback
      setTheme("light");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleProtectedAction = (href: string, message: string = 'Faça login para continuar') => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', href);
      localStorage.setItem('loginMessage', message);
      window.location.href = '/login';
    } else {
      window.location.href = href;
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isProtected: boolean) => {
    if (isProtected && !isLoggedIn) {
      e.preventDefault();
      handleProtectedAction(href, 'Faça login para acessar suas leituras atuais');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-morphism 
      bg-white/70 backdrop-blur-md 
      dark:bg-gray-900/70 dark:backdrop-blur-md
      wood:bg-[var(--color-background)]/90 wood:backdrop-blur-md wood:border-b wood:border-[var(--color-primary-900)] dark:border-[var(--color-dark-900)]">
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
          {/* Logo com Link para Home */}
          <Link
            href="/"
            aria-label="Ir para a página inicial"
            className="flex items-center rounded-md"
            style={{ gap: '0.5rem' }}
          >
            <div className="relative">
              <div
                className="w-8 h-8 lg:w-10 lg:h-10 
    bg-gradient-to-r from-primary-500 to-primary-800 
    rounded-xl flex items-center justify-center"
                style={{
                  boxShadow: '0 4px 15px var(--logo-shadow-current)',
                }}
              >
                <FaBookOpen className="text-white text-sm lg:text-lg" aria-hidden="true" />
              </div>

              <div
                className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse"
                style={{
                  top: '-0.125rem',
                  right: '-0.125rem'
                }}
                aria-hidden="true"
              ></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg lg:text-xl font-bold 
                text-gray-900 dark:text-blue-300 wood:text-[var(--color-foreground)]">
                Litera
              </h1>
              <p
                className="text-xs text-gray-500 
                  dark:text-blue-200 wood:text-[var(--color-accent-100)]"
                style={{ lineHeight: '1.3' }}
              >
                Biblioteca Digital
              </p>
            </div>
            <div className="lg:hidden">
              <h1 className="text-lg font-bold 
                text-gray-900 dark:text-blue-300 wood:text-[var(--color-foreground)]">
                Litera
              </h1>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav
            className="hidden lg:flex items-center"
            style={{ gap: '0.25rem' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.protected)}
                className="flex items-center text-sm font-medium 
                  text-gray-700 dark:text-blue-200 wood:text-[var(--color-secondary-200)]
                  border-transparent 
                  hover:text-primary-600 dark:hover:text-primary-400 wood:hover:text-[var(--color-primary-400)]
                  rounded-lg transition-all duration-200 
                  hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)]
                  hover:shadow-md group"
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

            <div
              className="w-px h-6 bg-gray-300 dark:bg-gray-700 wood:bg-[var(--color-primary-800)]"
              style={{
                marginLeft: '0.5rem',
                marginRight: '0.5rem'
              }}
            ></div>

            <button
              onClick={() => handleProtectedAction('/books/new', 'Faça login para adicionar um novo livro')}
              className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              style={{
                gap: '0.5rem',
                padding: '0.5rem 0.75rem'
              }}
            >
              <FaPlus className="text-xs" />
              <span className="hidden xl:inline">Novo Livro</span>
            </button>

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="flex items-center text-primary-600 dark:text-primary-400 wood:text-[var(--color-accent-400)] font-medium rounded-lg 
                  hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] transition-all duration-200"
                style={{
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FaSignInAlt className="text-sm" />
                <span className="hidden xl:inline">Faça login</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  const confirmed = window.confirm('Tem certeza que deseja sair?');
                  if (confirmed) handleLogout();
                }}
                className="flex items-center text-red-600 dark:text-red-400 wood:text-[var(--color-accent-400)] font-medium rounded-lg 
                  hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] transition-all duration-200 cursor-pointer"
                style={{
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FaSignInAlt className="text-sm rotate-180" />
                <span className="hidden xl:inline">Sair</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-lg transition-colors duration-200 hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] cursor-pointer"
              style={{ padding: '0.5rem' }}
              aria-label="Alterar tema"
            >
              {mounted ? (
                resolvedTheme === 'light' ? (
                  <FaMoon className="text-gray-700 text-sm" />
                ) : resolvedTheme === 'dark' ? (
                  <FaSun className="text-yellow-400 text-sm" />
                ) : (
                  // Ícone Personalizado para o tema 'wood' (Blood Moon)
                  <svg
                    className="text-sm"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="bloodMoonGradient" cx="30%" cy="30%">
                        {/* Cores baseadas em primary-600/500/accent-500 */}
                        <stop offset="20%" stopColor="var(--color-primary-600)" />
                        <stop offset="80%" stopColor="var(--color-primary-500)" />
                        <stop offset="100%" stopColor="var(--color-accent-500)" />
                      </radialGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#bloodMoonGradient)" />
                  </svg>
                )
              ) : null}
            </button>
          </nav>

          {/* Menu Mobile */}
          <div
            className="flex items-center lg:hidden"
            style={{ gap: '0.5rem' }}
          >
            <button
              onClick={toggleTheme}
              className="rounded-lg transition-colors duration-200 hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)]"
              style={{ padding: '0.5rem' }}
              aria-label="Alterar tema"
            >
              {mounted ? (
                resolvedTheme === 'light' ? (
                  <FaMoon className="text-gray-700 text-sm" />
                ) : resolvedTheme === 'dark' ? (
                  <FaSun className="text-yellow-400 text-sm" />
                ) : (
                  // Ícone Personalizado para o tema 'wood' (Blood Moon)
                  <svg
                    className="text-sm"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="bloodMoonGradient-mobile" cx="30%" cy="30%">
                        <stop offset="20%" stopColor="var(--color-primary-600)" />
                        <stop offset="80%" stopColor="var(--color-primary-500)" />
                        <stop offset="100%" stopColor="var(--color-accent-500)" />
                      </radialGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#bloodMoonGradient-mobile)" />
                  </svg>
                )
              ) : null}
            </button>

            <button
              onClick={toggleMenu}
              className="rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] transition-colors"
              style={{ padding: '0.5rem' }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ?
                <FaTimes className="text-gray-700 dark:text-gray-200 wood:text-[var(--color-foreground)] text-lg" /> :
                <FaBars className="text-gray-700 dark:text-gray-200 wood:text-[var(--color-foreground)] text-lg" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="lg:hidden glass-morphism 
            border-t border-gray-300 dark:border-gray-700 wood:border-t wood:border-[var(--color-primary-900)] 
            bg-white/90 dark:bg-gray-900/90 wood:bg-[var(--color-background)]
            animate-slide-down"
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
                onClick={(e) => {
                  handleNavClick(e, link.href, link.protected);
                  setMenuOpen(false);
                }}
                className="flex items-center 
                  text-gray-700 dark:text-gray-200 wood:text-[var(--color-secondary-200)] 
                  rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] 
                  transition-all duration-200"
                style={{
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <span className="text-sm">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                handleProtectedAction('/books/new', 'Faça login para adicionar um novo livro');
              }}
              className="w-full flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg transition-all duration-200"
              style={{
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                marginTop: '0.5rem'
              }}
            >
              <FaPlus className="text-sm" />
              <span className="text-sm font-medium">Novo Livro</span>
            </button>

            <div className="border-t border-gray-300 dark:border-gray-700 wood:border-[var(--color-primary-800)] my-2"></div>

            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center text-primary-600 dark:text-primary-400 wood:text-[var(--color-accent-400)] font-medium rounded-lg 
                  hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] transition-all duration-200"
                style={{
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FaSignInAlt className="text-sm" />
                <span className="text-sm font-medium">Faça login</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center text-red-600 dark:text-red-400 wood:text-[var(--color-accent-400)] font-medium rounded-lg 
                  hover:bg-white/50 dark:hover:bg-gray-800 wood:hover:bg-[var(--color-primary-800)] transition-all duration-200"
                style={{
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FaSignInAlt className="text-sm rotate-180" />
                <span className="text-sm font-medium">Sair</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}