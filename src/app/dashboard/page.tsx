'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // se estiver usando shadcn, senão pode usar div normal
import { FaBook, FaBookOpen, FaCheck, FaFileAlt } from 'react-icons/fa';

export default function DashboardPage() {
  // Simulando estado — depois você pode integrar com seu estado global ou backend
  const [stats] = useState({
    totalBooks: 12,
    readingNow: 3,
    finishedBooks: 7,
    totalPagesRead: 2150,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">📊 Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaBook className="text-indigo-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Total de livros</p>
            <p className="text-xl font-semibold">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaBookOpen className="text-blue-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Lendo atualmente</p>
            <p className="text-xl font-semibold">{stats.readingNow}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaCheck className="text-green-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Finalizados</p>
            <p className="text-xl font-semibold">{stats.finishedBooks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaFileAlt className="text-orange-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Páginas lidas</p>
            <p className="text-xl font-semibold">{stats.totalPagesRead}</p>
          </div>
        </div>
      </div>

      {/* Links rápidos */}
      <div className="flex gap-4">
        <Link
          href="/books"
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          📚 Ver livros
        </Link>
        <Link
          href="/books/new"
          className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
        >
          ➕ Novo livro
        </Link>
      </div>
    </div>
  );
}
