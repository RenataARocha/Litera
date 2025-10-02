

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaBookOpen, FaChartLine, FaPlus, FaBars, FaTimes, FaBook, FaMoon, FaSun, FaSignInAlt } from 'react-icons/fa';

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
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
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
    <header className="sticky top-0 z-50 glass-morphism dark:bg-gray-900/70 dark:backdrop-blur-md">
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
          {/* Logo */}
          <div
            className="flex items-center"
            style={{ gap: '0.5rem' }}
          >
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
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
              <h1 className="text-lg lg:text-xl font-bold text-gradient dark:text-blue-300">Litera</h1>
              <p
                className="text-xs text-gray-500 dark:text-blue-200"
                style={{ lineHeight: '1.3' }}
              >
                Biblioteca Digital
              </p>
            </div>
            <div className="lg:hidden">
              <h1 className="text-lg font-bold text-gradient">Litera</h1>
            </div>
          </div>

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
                className="flex items-center text-sm font-medium text-gray-700 border-transparent dark:hover:border-r dark:hover:border-b dark:hover:border-[#3b82f6] dark:text-blue-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800 hover:shadow-md group"
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
              className="w-px h-6 bg-white/30 dark:bg-gray-700"
              style={{
                marginLeft: '0.5rem',
                marginRight: '0.5rem'
              }}
            ></div>

            <button
              onClick={() => handleProtectedAction('/books/new', 'Faça login para adicionar um novo livro')}
              className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                className="flex items-center text-primary-600 dark:text-primary-400 font-medium rounded-lg text-sm hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200"
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
                onClick={handleLogout}
                className="flex items-center text-red-600 dark:text-red-400 font-medium rounded-lg text-sm hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200"
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

          {/* Menu Mobile */}
          <div
            className="flex items-center lg:hidden"
            style={{ gap: '0.5rem' }}
          >
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
                onClick={(e) => {
                  handleNavClick(e, link.href, link.protected);
                  setMenuOpen(false);
                }}
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

            <div className="border-t border-white/20 dark:border-gray-700 my-2"></div>

            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center text-primary-600 dark:text-primary-400 font-medium rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200"
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
                className="w-full flex items-center text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200"
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