'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaBookOpen, FaCheck, FaFileAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { useRouter } from "next/navigation";


type Color = 'blue' | 'green' | 'purple';

interface GoalCircleProps {
  percentage: number;
  title: string;
  subtitle: string;
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

const GoalCircle: React.FC<GoalCircleProps> = ({ percentage, title, subtitle, color = "blue" }) => {
  const colorMap: Record<Color, string> = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    purple: "stroke-purple-500",
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl p-6 text-center min-w-[200px] flex flex-col items-center">
      <div
        className="relative w-20 h-20 mx-auto"
        style={{ marginBottom: '1rem' }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={6}
            fill="none"
          />
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
      <h3
        className="font-semibold text-gray-800 text-sm"
      >
        {title}
      </h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

const Home: React.FC = () => {
  const [stats] = useState({
    totalBooks: 5,
    readingNow: 1,
    finishedBooks: 2,
    totalPagesRead: 688,
  });

  const router = useRouter();


  return (
    <div
      className="flex flex-col gap-6"
      style={{ padding: '2rem' }}
    >
      {/* Seção principal de boas-vindas */}
      <div
        className="text-white flex justify-between items-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 p-8 mb-8 shadow-2xl"
        style={{ padding: '2rem' }}
      >
        <div className="z-10">
          <h1 className="text-5xl font-bold ">Bem-vindo de volta!</h1>
          <p className="text-xl mb-3 text-blue-100 mt-6" style={{ lineHeight: '2.8' }}>Gerencie sua biblioteca pessoal com estilo</p>
          <div className="flex items-center gap-2 text-base text-blue-100 ">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse "></div>
            <span>Sistema Online</span>
            <span>•</span>
            <span>sexta-feira, 19 de setembro de 2025</span>
          </div>
        </div>

        {/* Círculo de progresso */}
        <div className="relative w-20 h-20 z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
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
              r="36"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={226}
              strokeDashoffset={136}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">40%</span>
          </div>
        </div>

        {/* Padrão de fundo sutil */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute right-8 bottom-0 w-24 h-24 bg-white opacity-5 rounded-full transform translate-y-8"></div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
              <FaBook className="text-blue-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12% este mês
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Total de Livros</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
              <FaBookOpen className="text-green-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Em progresso
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Lendo Agora</p>
            <p className="text-3xl font-bold text-gray-800">{stats.readingNow}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
              <FaCheck className="text-purple-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Meta: 50/ano
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Concluídos</p>
            <p className="text-3xl font-bold text-gray-800">{stats.finishedBooks}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-200">
              <FaFileAlt className="text-orange-500 text-lg group-hover:animate-bounce" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Este ano
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Páginas Lidas</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalPagesRead}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade Recente */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100"
          style={{ padding: '1.5rem' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Atividade Recente</h2>
            <Link href="/books" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-5">
            {recentActivity.map((book, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl hover:bg-gray-50 transition-colors"
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
                  <h3
                    className="font-semibold text-gray-800 text-sm truncate"
                    style={{ marginBottom: '0.25rem', lineHeight: '1.2' }}
                  >
                    {book.title}
                  </h3>
                  <p
                    className="text-xs text-gray-500"
                    style={{ marginBottom: '0.5rem', lineHeight: '1.3' }}
                  >
                    {book.author}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Lido' ? 'bg-blue-100 text-blue-700' :
                      book.status === 'Lendo' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {book.status}
                    </span>

                    {/* Estrelas de rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {book.lastRead}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-7 mt-4"
          style={{ padding: '1.5rem' }}
        >
          <h2 className="text-lg font-bold text-gray-800">Ações Rápidas</h2>

          <div className="flex flex-col gap-3">
            <Link
              href="/books/new"
              className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg font-medium text-sm hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <FaPlus className="text-sm group-hover:animate-bounce" />
              Adicionar Livro
            </Link>

            <button onClick={() => router.push('/books')} className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 hover:bg-teal-50 hover:shadow-md font-medium text-sm border border-gray-200 hover:border-cyan-200 cursor-pointer hover:transform transition-all duration-200 group">
              <FaSearch className="text-base text-gray-400 group-hover:animate-bounce" />
              Explorar Biblioteca
            </button>

            <button className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 hover:bg-teal-50 hover:shadow-md font-medium text-sm border border-gray-200 hover:border-cyan-200 cursor-pointer hover:transform transition-all duration-200 group">
              <FaBook className="text-base text-gray-400 group-hover:animate-bounce" />
              Leituras Atuais
            </button>
          </div>
        </div>

      </div>

      {/* Metas de Leitura */}
      <div
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
        style={{ padding: '1.5rem' }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-12"
          style={{ marginBottom: '1.5rem' }}>Metas de Leitura 2024</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GoalCircle
            percentage={20}
            title="Livros por Ano"
            subtitle="10 de 50 livros"
            color="blue"
          />
          <GoalCircle
            percentage={40}
            title="Páginas por Mês"
            subtitle="800 de 2000 páginas"
            color="green"
          />
          <GoalCircle
            percentage={50}
            title="Gêneros Diversos"
            subtitle="5 de 10 gêneros"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;