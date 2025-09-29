'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaBookOpen, FaCheck, FaFileAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// --- Interfaces e Tipos ---
type Color = 'blue' | 'green' | 'purple';

interface GoalCircleProps {
  percentage: number;
  title: string;
  subtitle?: string;
  color?: Color;
}

interface Book {
  title: string;
  author: string;
  status: 'Lido' | 'Lendo' | 'Quero Ler' | string;
  rating: number;
  lastRead: string;
  cover: string;
}

interface Stats {
  totalBooks: number;
  readingNow: number;
  finishedBooks: number;
  totalPagesRead: number;
}

// --- Dados Mock ---
const recentActivity: Book[] = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    status: "Lido",
    rating: 5,
    lastRead: "3 dias atrás",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=80&fit=crop"
  },
  {
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    status: "Lendo",
    rating: 5,
    lastRead: "4 dias atrás",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=80&fit=crop"
  },
  {
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    status: "Lendo",
    rating: 4,
    lastRead: "5 dias atrás",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=60&h=80&fit=crop"
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    status: "Quero Ler",
    rating: 0,
    lastRead: "6 dias atrás",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=60&h=80&fit=crop"
  },
  {
    title: "1984",
    author: "George Orwell",
    status: "Lendo",
    rating: 4,
    lastRead: "1 semana atrás",
    cover: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=60&h=80&fit=crop"
  }
];

const stats: Stats = {
  totalBooks: 152,
  readingNow: 8,
  finishedBooks: 10,
  totalPagesRead: 3245,
};

// --- GoalCircle ---
const DisplayGoalCircle: React.FC<GoalCircleProps> = ({ percentage, title, subtitle, color = "blue" }) => {
  const colorMap: Record<Color, string> = {
    blue: "#3B82F6",
    green: "#10B981",
    purple: "#8B5CF6",
  };

  const selectedColor = colorMap[color];
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(0,0,0,0.1)"
            className="dark:stroke-gray-700"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={selectedColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{percentage}%</span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-center">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">{subtitle}</p>}
    </div>
  );
};

// --- Componente Home ---
const Home: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div
      className="flex flex-col gap-6"
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero */}
      <div
        className="text-white flex justify-between items-center relative overflow-hidden rounded-3xl 
                   bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 
                   dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 dark:shadow-[#60a5fa] dark:shadow-sm
                   p-8 mb-8 shadow-2xl"
        style={{ padding: "2rem", marginBottom: "2rem" }}
      >
        <div className="z-10">
          <h1 className="text-5xl font-bold dark:text-blue-400">Bem-vindo de volta!</h1>
          <p className="text-xl mb-3 text-blue-100 dark:text-blue-200 mt-6">
            Gerencie sua biblioteca pessoal com estilo
          </p>
          <div className="flex items-center gap-2 text-base text-blue-100 dark:text-blue-400" style={{ marginTop: "2rem" }}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="dark:text-blue-200">Sistema Online</span>
            <span className="dark:text-blue-200">•</span>
            <span className="dark:text-blue-200">sexta-feira, 19 de setembro de 2025</span>
          </div>
        </div>

        {/* Progresso */}
        <div className="relative w-20 h-20 z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80 ">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={36}
              stroke="#BFDBFE"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={2 * Math.PI * 36 * (1 - 70 / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold dark:text-blue-200">70%</span>
          </div>
        </div>

        {/* Background decorativo */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 dark:bg-slate-200 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute right-8 bottom-0 w-24 h-24 bg-white opacity-5 dark:bg-slate-200 rounded-full transform translate-y-8"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Livros */}
        <div
          className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm 
                     border border-gray-100 dark:border-slate-700 
                     hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-600 dark:shadow-[#60a5fa]
                     hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-800/60 transition-colors duration-200">
              <FaBook className="text-blue-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/40 px-4 py-2 dark:p-4 rounded-full">
              +12% este mês
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-blue-200 text-sm mb-1">Total de Livros</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-blue-200">{stats.totalBooks}</p>
          </div>
        </div>

        {/* Lendo Agora */}
        <div
          className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm 
                     border border-gray-100 dark:border-slate-700 
                     hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-600 dark:shadow-[#60a5fa]
                     hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/40 rounded-xl flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-800/60 transition-colors duration-200">
              <FaBookOpen className="text-green-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded-full">
              Em progresso
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-blue-200 text-sm mb-1">Lendo Agora</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-blue-200">{stats.readingNow}</p>
          </div>
        </div>

        {/* Concluídos */}
        <div
          className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm 
                     border border-gray-100 dark:border-slate-700 
                     hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-600 dark:shadow-[#60a5fa]
                     hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/40 rounded-xl flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-800/60 transition-colors duration-200">
              <FaCheck className="text-purple-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 px-2 py-1 rounded-full">
              Meta: 50/ano
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-blue-200 text-sm mb-1">Concluídos</p>
            <p className="text-3xl font-bold text-grey-500 dark:text-blue-200">{stats.finishedBooks}</p>
          </div>
        </div>

        {/* Páginas Lidas */}
        <div
          className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm 
                     border border-gray-100 dark:border-slate-700 
                     hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-600 dark:shadow-[#60a5fa]
                     hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/40 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-800/60 transition-colors duration-200">
              <FaFileAlt className="text-orange-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/40 px-2 py-1 rounded-full">
              Este ano
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-blue-200 text-sm mb-1">Páginas Lidas</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-blue-200">{stats.totalPagesRead}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div
          className="lg:col-span-2 bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
          style={{ padding: '1.5rem' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Atividade Recente</h2>
            <Link href="/books" className="text-sm text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-5">
            {recentActivity.map((book, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors"
                style={{ padding: '0.75rem 0.5rem' }}
              >
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={48}
                  height={64}
                  className="object-cover rounded-lg shadow-sm flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate" style={{ marginBottom: '0.25rem', lineHeight: '1.2' }}>
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400" style={{ marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    {book.author}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                        ${book.status === 'Lido'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                          : book.status === 'Lendo'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                            : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                        }`}
                    >
                      {book.status}
                    </span>

                    {/* Estrelas */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < book.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {book.lastRead}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div
          className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-7"
          style={{ padding: '1.5rem', marginTop: '1rem' }}
        >
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Ações Rápidas</h2>

          <div className="flex flex-col gap-3">
            <Link
              href="/books/new"
              className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg font-medium text-sm hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <FaPlus className="text-sm group-hover:animate-bounce" />
              Adicionar Livro
            </Link>

            <button
              onClick={() => router.push('/books')}
              className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl 
                         bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-200 
                         hover:bg-teal-50 dark:hover:bg-slate-600 hover:shadow-md 
                         font-medium text-sm border border-gray-200 dark:border-slate-600 
                         hover:border-teal-200 dark:hover:border-teal-500 
                         hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <FaSearch className="text-sm group-hover:animate-bounce" />
              Procurar Livros
            </button>
          </div>
        </div>

        <div className=" backdrop-blur-sm rounded-2xl col-span-3 shadow-lg border-t border-gray-100 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Metas de Leitura 2024</h3>
          <div className="grid grid-cols-3 gap-3">
            <DisplayGoalCircle percentage={70} title="Meta Anual" subtitle="35/50" color="blue" />
            <DisplayGoalCircle percentage={50} title="Este Mês" subtitle="2/4" color="green" />
            <DisplayGoalCircle percentage={80} title="Coleção" subtitle="120/150" color="purple" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Home;
