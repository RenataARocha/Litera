"use client"

import Link from 'next/link'
import { useState } from 'react'
import { FaBookOpen, FaChartLine, FaPlus, FaBars, FaTimes, FaBook } from 'react-icons/fa'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { href: '/books', label: 'Biblioteca', icon: <FaBook /> },
    ];

    return (
        <header className="glass-morphism sticky top-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logotipo e título */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                                    <FaBookOpen className="text-white text-lg" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">BookShelf</h1>
                                <p className="text-xs text-gray-500">Biblioteca Digital</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Menu Desktop */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="nav-btn group px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/20">
                                <i className="mr-2 group-hover:animate-bounce-subtle">{link.icon}</i>{link.label}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-white/20 mx-2"></div>
                        <Link href="/books/new" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <FaPlus className="inline-block mr-2" />
                            Novo Livro
                        </Link>
                    </nav>
                    
                    {/* Botão do Menu Mobile */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)} 
                            className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                        >
                            {menuOpen ? <FaTimes className="text-gray-700" /> : <FaBars className="text-gray-700" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Menu Mobile */}
            <nav id="mobile-menu" className={`${menuOpen ? 'block animate-slide-down' : 'hidden'} md:hidden glass-morphism border-t border-white/20`}>
                <div className="px-4 py-3 space-y-2">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-white/20 transition-colors">
                            <i className="mr-3">{link.icon}</i>{link.label}
                        </Link>
                    ))}
                    <Link href="/books/new" onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl">
                        <FaPlus className="inline-block mr-3" />
                        Novo Livro
                    </Link>
                </div>
            </nav>
        </header>
    );
}