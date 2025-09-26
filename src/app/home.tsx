'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaBook, FaBookOpen, FaCheck, FaFileAlt, FaPlus, FaSearch } from 'react-icons/fa';
import type { Book } from './logic';

type Color = 'blue' | 'green' | 'purple';

interface GoalCircleProps {
  percentage: number;
  title: string;
  subtitle: string;
  color?: Color;
}

const GoalCircle: React.FC<GoalCircleProps> = ({ percentage, title, subtitle, color = 'blue' }) => {
  const colorMap: Record<Color, string> = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    purple: 'stroke-purple-500',
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl p-6 text-center min-w-[200px] flex flex-col items-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={radius} stroke="#E5E7EB" strokeWidth={6} fill="none" />
          <circle
            cx={40}
            cy={40}
            r={radius}
            className={colorMap[color]}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{Math.round(percentage)}%</span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

const Home: React.FC<{ recentActivity: Book[] }> = ({ recentActivity }) => {
  const [stats] = useState({
    totalBooks: recentActivity.length,
    readingNow: recentActivity.filter((book) => book.status === 'Lendo').length,
    finishedBooks: recentActivity.filter((book) => book.status === 'Lido').length,
    totalPagesRead: 688, // pode calcular dinamicamente se tiver páginas
  });

  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Banner de boas-vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 p-8 shadow-2xl text-white mb-8">
        <h1 className="text-5xl font-bold mb-4">Bem-vindo de volta!</h1>
        <p className="text-xl mb-3 text-blue-100">Gerencie sua biblioteca pessoal com estilo</p>
        <div className="flex items-center gap-2 text-base text-blue-100">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Sistema Online</span>
          <span>•</span>
          <span>sexta-feira, 19 de setembro de 2025</span>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Livros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all p-5 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FaBook className="text-blue-500 text-lg" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12% este mês
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total de Livros</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
        </div>

        {/* Lendo Agora */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all p-5 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FaBookOpen className="text-green-500 text-lg" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Em progresso
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Lendo Agora</p>
          <p className="text-3xl font-bold text-gray-800">{stats.readingNow}</p>
        </div>

        {/* Concluídos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all p-5 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaCheck className="text-purple-500 text-lg" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Meta: 50/ano
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Concluídos</p>
          <p className="text-3xl font-bold text-gray-800">{stats.finishedBooks}</p>
        </div>

        {/* Páginas Lidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all p-5 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <FaFileAlt className="text-orange-500 text-lg" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Este ano
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Páginas Lidas</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalPagesRead}</p>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Atividade Recente</h2>
            <Link href="/books" className="text-sm text-blue-500 hover:text-blue-600">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-5">
            {recentActivity.map((book, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl hover:bg-gray-50 transition-colors p-2"
              >
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={48}
                  height={64}
                  className="object-cover rounded-lg flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{book.title}</h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === 'Lido'
                          ? 'bg-blue-100 text-blue-700'
                          : book.status === 'Lendo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {book.status}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{book.lastRead}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 p-6 mt-4">
          <h2 className="text-lg font-bold text-gray-800">Ações Rápidas</h2>
          <Link
            href="/books/new"
            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg font-medium text-sm"
          >
            <FaPlus className="text-sm" />
            Adicionar Livro
          </Link>

          <button
            onClick={() => router.push('/books')}
            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 border border-gray-200 hover:bg-teal-50 hover:border-cyan-200 font-medium text-sm"
          >
            <FaSearch className="text-base text-gray-400" />
            Explorar Biblioteca
          </button>

          <Link
            href="/leituras-atuais"
            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 border border-gray-200 hover:bg-teal-50 hover:border-cyan-200 font-medium text-sm"
          >
            <FaBook className="text-base text-gray-400" />
            Leituras Atuais
          </Link>
        </div>
      </div>

      {/* Metas de leitura */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Metas de Leitura 2024</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GoalCircle percentage={20} title="Livros por Ano" subtitle="10 de 50 livros" color="blue" />
          <GoalCircle percentage={40} title="Páginas por Mês" subtitle="800 de 2000 páginas" color="green" />
          <GoalCircle percentage={50} title="Gêneros Diversos" subtitle="5 de 10 gêneros" color="purple" />
        </div>
      </div>
    </div>
  );
};

export default Home;
