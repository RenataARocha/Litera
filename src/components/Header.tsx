"use client"

// components/Header.tsx
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header>
            <h1>Litera</h1>

            {/* Menu desktop */}
            <nav>
                <Link href="dashboard">Dashboard</Link>
                <Link href="biblioteca">Biblioteca</Link>
                <Link href="adicionar-livro">Adicionar Livro</Link>
            </nav>

            {/* Menu mobile */}
            <button className='md:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {menuOpen && (
                <nav>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/biblioteca">Biblioteca</Link>
                    <Link href="/adicionar-livro">Adicionar Livro</Link>
                </nav>
            )}
        </header>
    )
}