'use client'; // 👈 Essencial para usar hooks e interatividade

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBook, FaBookOpen, FaCheck, FaFileAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Book, Stats, DashboardProps, GoalCircleProps, Color } from '@/types/types';

// --- DisplayGoalCircle (Definição para uso dentro do Home) ---

const DisplayGoalCircle: React.FC<GoalCircleProps> = ({ percentage, title, subtitle, color = "blue" }) => {
    const colorMap: Record<Color, string> = {
        blue: "#3B82F6",
        green: "#10B981",
        purple: "#8B5CF6",
        orange: "#F97316",
    };

    const selectedColor = colorMap[color];
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - percentage / 100);

    return (
        <div className="flex flex-col items-center dark:text-gray-100">
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="rgba(0,0,0,0.1)"
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
                    <span className="text-xl font-bold text-gray-800">{percentage}%</span>
                </div>
            </div>
            <h3 className="font-semibold text-gray-700 text-center">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 text-center mt-1">{subtitle}</p>}
        </div>
    );
};

// --- Home (Componente Principal) ---
const Home: React.FC<DashboardProps> = ({ recentActivity, stats }) => {
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
            {/* Seção principal de boas-vindas */}
            <div
                className="text-white flex justify-between items-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 p-8 mb-8 shadow-2xl
                dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 dark:shadow-[#3b82f6] dark:shadow-sm dark:text-blue-200"
                style={{ padding: "2rem", marginBottom: "2rem" }}
            >
                <div className="z-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold dark:text-blue-400">
                        Bem-vindo de volta!
                    </h1>
                    <p
                        className="text-base sm:text-lg md:text-xl text-blue-100"
                        style={{
                            lineHeight: "1.2",
                            marginTop: "0.5rem",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Gerencie sua biblioteca pessoal com estilo
                    </p>
                    <div
                        className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-base text-blue-100"
                        style={{
                            marginTop: "1rem",
                            gap: "0.5rem"
                        }}
                    >
                        <div className="flex items-center" style={{ gap: "0.5rem" }}>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Sistema Online</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm">
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Círculo de progresso */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 z-10">
                    <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 80 80"
                    >
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
                            stroke="white"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 36}
                            strokeDashoffset={2 * Math.PI * 36 * (1 - ((stats?.finishedBooks ?? 0) / (stats?.totalBooks || 1)) * 100 / 100)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold">
                            {Math.round(((stats?.finishedBooks ?? 0) / (stats?.totalBooks || 1)) * 100)}
                        </span>
                    </div>
                </div>

                {/* Padrão de fundo sutil */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute right-8 bottom-0 w-24 h-24 bg-white opacity-5 rounded-full transform translate-y-8"></div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de Livros */}
                <div
                    role="region"
                    aria-labelledby="stat-total-books"
                    tabIndex={0}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 dark:shadow-[#3b82f6] dark:bg-slate-800/90 dark:border-slate-700 dark:border-none hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
                    style={{ padding: '1.25rem' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-200/20 dark:group-hover:bg-blue-200/20 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                            <FaBook aria-hidden="true" className="text-blue-500 text-lg group-hover:animate-bounce" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-transparent dark:text-green-400 px-2 py-1 rounded-full">
                            +12% este mês
                        </span>
                    </div>
                    <div>
                        <p id="stat-total-books" className="text-gray-500 dark:text-blue-200 text-sm mb-1">Total de Livros</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-blue-200" aria-label={`Total de livros: ${stats?.totalBooks ?? 0}`}>
                            {stats?.totalBooks ?? 0}
                        </p>
                    </div>
                </div>

                {/* Lendo Agora */}
                <div
                    role="region"
                    aria-labelledby="stat-reading-now"
                    tabIndex={0}
                    className="bg-white rounded-2xl shadow-sm border dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
                    style={{ padding: '1.25rem' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex dark:bg-green-200/20 dark:group-hover:bg-green-200/20 items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
                            <FaBookOpen aria-hidden="true" className="text-green-500 text-lg group-hover:animate-bounce" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 dark:bg-transparent dark:text-blue-400 bg-blue-50 px-2 py-1 rounded-full">
                            Em progresso
                        </span>
                    </div>
                    <div>
                        <p id="stat-reading-now" className="text-gray-500 dark:text-blue-200 text-sm mb-1">Lendo Agora</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-blue-200" aria-label={`Livros em leitura: ${stats?.readingNow ?? 0}`}>
                            {stats?.readingNow ?? 0}
                        </p>
                    </div>
                </div>

                {/* Concluídos */}
                <div
                    role="region"
                    aria-labelledby="stat-finished-books"
                    tabIndex={0}
                    className="bg-white rounded-2xl shadow-sm border dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
                    style={{ padding: '1.25rem' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-200/20 dark:group-hover:bg-purple-200/20 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
                            <FaCheck aria-hidden="true" className="text-purple-500 text-lg group-hover:animate-bounce" />
                        </div>
                        <span className="text-xs font-medium text-purple-600  dark:bg-transparent dark:text-purple-400 bg-purple-50 px-2 py-1 rounded-full">
                            Este ano
                        </span>
                    </div>
                    <div>
                        <p id="stat-finished-books" className="text-gray-500 dark:text-blue-200 text-sm mb-1">Concluídos</p>
                        <p className="text-3xl font-bold dark:text-blue-200 text-gray-800" aria-label={`Livros concluídos: ${stats?.finishedBooks ?? 0}`}>
                            {stats?.finishedBooks ?? 0}
                        </p>
                    </div>
                </div>

                {/* Páginas Lidas */}
                <div
                    role="region"
                    aria-labelledby="stat-pages-read"
                    tabIndex={0}
                    className="bg-white rounded-2xl shadow-sm border dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none border-gray-100 hover:shadow-lg hover:border-gray-200 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
                    style={{ padding: '1.25rem' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-200/20 dark:group-hover:bg-orange-200/20 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-200">
                            <FaFileAlt aria-hidden="true" className="text-orange-500 text-lg group-hover:animate-bounce" />
                        </div>
                        <span className="text-xs font-medium text-orange-600  dark:bg-transparent dark:text-orange-400 bg-orange-50 px-2 py-1 rounded-full">
                            Este ano
                        </span>
                    </div>
                    <div>
                        <p id="stat-pages-read" className="text-gray-500 dark:text-blue-200 text-sm mb-1">Páginas Lidas</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-blue-200" aria-label={`Total de páginas lidas: ${stats?.totalPagesRead ?? 0}`}>
                            {stats?.totalPagesRead ?? 0}
                        </p>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Atividade Recente */}
                <div
                    className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 
                    dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none"
                    style={{ padding: '1.5rem' }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-blue-400">Atividade Recente</h2>
                        <Link href="/books" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                            Ver tudo
                        </Link>
                    </div>

                    <div className="space-y-5 flex flex-col gap-y-4">
                        {(recentActivity ?? []).map((book, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-xl hover:bg-gray-50 transition-colors
                                dark:bg-blue-200/10 dark:hover:bg-blue-200/20"
                                style={{ padding: '0.75rem 0.5rem' }}
                            >
                                <Image
                                    src={book.cover || '/path/to/placeholder-cover.jpg'}
                                    alt={book.title}
                                    width={48}
                                    height={64}
                                    className="object-cover rounded-lg shadow-sm flex-shrink-0"
                                    unoptimized
                                />
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className="font-semibold text-gray-800 text-sm truncate dark:text-blue-400"
                                        style={{ marginBottom: '0.25rem', lineHeight: '1.2' }}
                                    >
                                        {book.title}
                                    </h3>
                                    <p
                                        className="text-xs text-gray-500 dark:text-blue-200"
                                        style={{ marginBottom: '0.5rem', lineHeight: '1.3' }}
                                    >
                                        {book.author}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Lido' ? 'bg-blue-100 text-blue-700' :
                                            book.status === 'Lendo' ? 'bg-green-100 text-green-700 dark:text-green-400' :
                                                'bg-gray-100 text-gray-700'
                                            } dark:bg-transparent dark:text-blue-200 `}>
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
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-7 dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none"
                    style={{ padding: '1.5rem'}}
                >
                    <h2 className="text-lg font-bold text-gray-800 dark:text-blue-400">Ações Rápidas</h2>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/books/new"
                            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg font-medium text-sm hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group
                            dark:bg-blue-200/20 dark:hover:bg-blue-200/20 dark:text-blue-200"
                        >
                            <FaPlus className="text-sm group-hover:animate-bounce" />
                            Adicionar Livro
                        </Link>

                        <button onClick={() => router.push('/books')} className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 hover:bg-teal-50 hover:shadow-md font-medium text-sm border border-gray-200 hover:border-cyan-200 cursor-pointer hover:transform transition-all duration-200 group
                        dark:bg-blue-200/20 dark:hover:bg-blue-200/20 dark:text-blue-200 dark:border-transparent">
                            <FaSearch className="text-base text-gray-400 dark:text-blue-200 group-hover:animate-bounce" />
                            Explorar Biblioteca
                        </button>

                        <Link
                            href="/leituras-atuais"
                            className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl bg-white text-gray-600 hover:bg-teal-50 hover:shadow-md font-medium text-sm border border-gray-200 hover:border-cyan-200 cursor-pointer hover:transform transition-all duration-200 group
                            dark:bg-blue-200/20 dark:hover:bg-blue-200/20 dark:text-blue-200 dark:border-transparent"
                        >
                            <FaBook className="text-base text-gray-400 dark:text-blue-200 group-hover:animate-bounce" />
                            Leituras Atuais
                        </Link>
                    </div>
                </div>

            </div>

            {/* Metas de Leitura */}
            <div
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg
                dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none dark:shadow-sm"
                style={{ padding: "1.5rem" }}
            >
                <h2
                    className="text-xl font-bold text-gray-900 dark:text-blue-400"
                    style={{ marginBottom: "1.5rem" }}
                >
                    Metas de Leitura 2024
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <DisplayGoalCircle
                        percentage={20}
                        title="Livros por Ano"
                        subtitle="10 de 50 livros"
                        color="blue"
                    />
                    <DisplayGoalCircle
                        percentage={40}
                        title="Páginas por Mês"
                        subtitle="800 de 2000 páginas"
                        color="green"
                    />
                    <DisplayGoalCircle
                        percentage={50}
                        title="Gêneros Diversos"
                        subtitle="5 de 10 gêneros"
                        color="purple"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Home;