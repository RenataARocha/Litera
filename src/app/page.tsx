'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaBook, FaBookOpen, FaCheck, FaFileAlt, FaPlus, FaSearch, FaPlayCircle } from 'react-icons/fa';

// Dados de exemplo para a seção de Atividade Recente
const recentActivity = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    status: "Lido",
    rating: 5,
    lastRead: "3 dias atrás",
  },
  {
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    status: "Lendo",
    rating: 5,
    lastRead: "4 dias atrás",
  },
  {
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    status: "Lendo",
    rating: 4,
    lastRead: "5 dias atrás",
  },
];

const GoalCircle = ({ percentage, title, subtitle }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative w-24 h-24 mb-2">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className="text-blue-500"
          strokeWidth="10"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 * (1 - percentage / 100)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          transform="rotate(-90) translate(-100 0)"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
        {percentage}%
      </div>
    </div>
    <span className="font-semibold text-slate-800">{title}</span>
    <span className="text-sm text-slate-500">{subtitle}</span>
  </div>
);

export default function Home() {
  const [stats] = useState({
    totalBooks: 5,
    readingNow: 1,
    finishedBooks: 2,
    totalPagesRead: 688,
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Seção principal de boas-vindas com a barra de progresso */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Bem-vindo de volta!</h1>
          <p className="text-sm opacity-90 mb-4">Gerencie sua biblioteca pessoal com estilo</p>
          <div className="text-xs opacity-80">
            <span>Sistema Online</span> • <span>sexta-feira, 19 de setembro de 2025</span>
          </div>
        </div>
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-white opacity-30"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-white"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 * (1 - 0.40)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              transform="rotate(-90) translate(-100 0)"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
            40%
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaBook className="text-indigo-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Total de Livros</p>
            <p className="text-xl font-semibold">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaBookOpen className="text-blue-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Lendo Agora</p>
            <p className="text-xl font-semibold">{stats.readingNow}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaCheck className="text-green-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Concluídos</p>
            <p className="text-xl font-semibold">{stats.finishedBooks}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <FaFileAlt className="text-orange-500 text-3xl" />
          <div>
            <p className="text-slate-500 text-sm">Páginas Lidas</p>
            <p className="text-xl font-semibold">{stats.totalPagesRead}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Atividade Recente</h2>
          {recentActivity.map((book, index) => (
            <div key={index} className="flex items-center gap-4 py-2 border-b last:border-b-0">
              <div className="w-16 h-20 bg-slate-200 rounded-lg flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-slate-500">{book.author}</p>
                <div className="text-xs text-blue-600 font-semibold">{book.status}</div>
              </div>
              <div className="ml-auto text-xs text-slate-400">{book.lastRead}</div>
            </div>
          ))}
          <Link href="/books" className="text-sm text-indigo-500 hover:underline">
            Ver tudo
          </Link>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Ações Rápidas</h2>
          <div className="flex flex-col gap-4">
            <Link
              href="/books/new"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              <FaPlus /> Adicionar Livro
            </Link>
            <Link
              href="/books"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
            >
              <FaSearch /> Explorar Biblioteca
            </Link>
            <Link
              href="#"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              <FaPlayCircle /> Leituras Atuais
            </Link>
          </div>
        </div>
      </div>
      
      {/* Metas de Leitura */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Metas de Leitura 2024</h2>
        <div className="flex justify-between items-center flex-wrap gap-6">
          <GoalCircle
            percentage={20}
            title="Livros por Ano"
            subtitle="10 de 50 livros"
          />
          <GoalCircle
            percentage={40}
            title="Páginas por Mês"
            subtitle="800 de 2000 páginas"
          />
          <GoalCircle
            percentage={50}
            title="Gêneros Diversos"
            subtitle="5 de 10 gêneros"
          />
        </div>
      </div>

    </div>
  );
}
