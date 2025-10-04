'use client';

import { Search } from 'lucide-react';
import { AnimatePresence, motion, Variants } from "framer-motion";

type FilterBarProps = {
    query: string;
    genre: string;
    status: string;
    genres: string[];
    onQueryChange: (value: string) => void;
    onGenreChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClearFilters: () => void;
};

export default function FilterBar({
    query,
    genre,
    status,
    onQueryChange,
    onGenreChange,
    onStatusChange,
    onClearFilters
}: FilterBarProps) {

    const hasActiveFilters = query || genre || status;

    // Variantes de animação do Container: Duração ajustada para ser mais lenta
    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8, // AUMENTADO PARA 0.8s
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.15, // AUMENTADO PARA 0.15s
                delayChildren: 0.2 // AUMENTADO PARA 0.2s
            }
        },
    };

    // Variantes de animação dos Itens: Duração ajustada para ser mais lenta
    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -15,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5, // AUMENTADO PARA 0.5s
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
    };

    const searchInfoVariants: Variants = {
        hidden: {
            opacity: 0,
            height: 0,
            y: -10
        },
        visible: {
            opacity: 1,
            height: "auto",
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    // Variantes para o texto de filtro (usa AnimatePresence)
    const filterTextVariants: Variants = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 5 }
    };


    return (
        <motion.div
            role="search"
            aria-label="Busca e filtros de livros"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300
            dark:bg-blue-200/20 dark:group-hover:bg-blue-200/20"
            style={{
                paddingLeft: '0.9rem',
                paddingRight: '2.5rem',
                paddingTop: '0.5rem',
                paddingBottom: '1rem',
                marginBottom: '2rem'
            }}
        >
            {/* Barra de busca */}
            <motion.div
                variants={itemVariants}
                className="relative w-full"
                style={{ margin: '1rem' }}
            >
                <div className="relative">
                    <label htmlFor="search-books" className="sr-only">
                        Buscar livros por título, autor ou ISBN
                    </label>

                    <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        animate={{
                            scale: query ? 0.9 : 1,
                            color: query ? "#3b82f6" : "#9ca3af"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <Search className="w-5 h-5" aria-hidden="true" />
                    </motion.div>

                    <motion.input
                        id="search-books"
                        type="text"
                        placeholder="Buscar por título, autor, ISBN..."
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        aria-label="Campo de busca"
                        className="  w-full h-12 rounded-xl 
                                    border border-gray-200 dark:border-blue-200/20
                                    bg-white dark:bg-slate-800/20 dark:hover:border-[#3b82f6]
                                    text-gray-700 dark:text-blue-200
                                    placeholder-gray-400 dark:placeholder-blue-200
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                    transition-all duration-300"
                        style={{
                            paddingLeft: '2.75rem',
                            paddingRight: query ? '2.5rem' : '1rem',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem'
                        }}
                        whileFocus={{
                            scale: 1.02,
                            borderColor: "#3b82f6",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                        }}
                        transition={{ duration: 0.2 }}
                    />

                    <AnimatePresence>
                        {query && (
                            <motion.button
                                key="clear-query-btn"
                                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onQueryChange('')}
                                aria-label="Limpar campo de busca"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                style={{ padding: '0.25rem' }}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {(query || genre || status) && (
                        <motion.div
                            key="search-info"
                            variants={searchInfoVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="text-xs text-gray-500 flex flex-wrap items-center"
                            style={{ marginTop: '0.5rem' }}
                            role="status"
                            aria-live="polite"
                        >
                            Buscando por:{" "}
                            {query && (
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key="query-text"
                                        variants={filterTextVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="font-medium text-gray-700 ml-1 mr-2"
                                    >
                                        “{query}”
                                    </motion.span>
                                </AnimatePresence>
                            )}
                            {genre && (
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key="genre-text"
                                        variants={filterTextVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="font-medium text-gray-700 ml-1 mr-2"
                                    >
                                        Gênero: “{genre}”
                                    </motion.span>
                                </AnimatePresence>
                            )}
                            {status && (
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key="status-text"
                                        variants={filterTextVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="font-medium text-gray-700 ml-1 mr-2"
                                    >
                                        Status: “{status}”
                                    </motion.span>
                                </AnimatePresence>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Filtros */}
            <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center "
                style={{ gap: '1rem', paddingLeft: '1rem' }}
                role="group"
                aria-label="Filtros de busca"
            >
                {/* Filtro por gênero */}
                <div className="relative">
                    <label htmlFor="genre-filter" className="sr-only">
                        Filtrar por gênero
                    </label>
                    <motion.select
                        id="genre-filter"
                        aria-label="Filtro de gênero"
                        className="w-full h-12 cursor-pointer rounded-xl border border-gray-200 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none 
                        transition-all duration-200 hover:border-gray-300 dark:hover:border-[#3b82f6]
                        dark:bg-blue-200/20 dark:text-blue-200 dark:border-transparent"
                        value={genre}
                        onChange={(e) => onGenreChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                    >
                        <option value="" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" >Todos os Gêneros 🏷️</option>
                        <option value="Literatura Brasileira" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Literatura Brasileira 📚</option>
                        <option value="Ficção Científica" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Ficção Científica 🚀</option>
                        <option value="Realismo Mágico" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Realismo Mágico ✨</option>
                        <option value="Ficção" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Ficção 📖</option>
                        <option value="Fantasia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Fantasia 🐉</option>
                        <option value="Romance" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Romance 💕</option>
                        <option value="Biografia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Biografia 👤</option>
                        <option value="História" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">História 🏛️</option>
                        <option value="Autoajuda" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Autoajuda 💪</option>
                        <option value="Tecnologia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Tecnologia 💻</option>
                        <option value="Programação" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Programação ⌨️</option>
                        <option value="Negócios" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Negócios 💼</option>
                        <option value="Psicologia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Psicologia 🧠</option>
                        <option value="Filosofia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Filosofia 🤔</option>
                        <option value="Poesia" className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200">Poesia 🎭</option>
                    </motion.select>
                </div>

                {/* Filtro por status */}
                <div className="relative">
                    <label htmlFor="status-filter" className="sr-only">
                        Filtrar por status de leitura
                    </label>
                    <motion.select
                        id="status-filter"
                        aria-label="Filtro de status"
                        className="w-full h-12 cursor-pointer rounded-xl border border-gray-200 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none transition-all 
                        duration-200 hover:border-gray-300
                        dark:hover:border-[#3b82f6]
                        dark:bg-blue-200/20 dark:text-blue-200 dark:border-transparent"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                    >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="">Todos os Status 📊</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="não lido">Não Lido 📚</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="quero ler">Quero Ler 🎯</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="lendo">Lendo 📖</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="lido">Lido ✅</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="pausado">Pausado ⏸️</option >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="abandonado">Abandonado ❌</option >
                    </motion.select>
                </div>

                {/* Botão limpar filtros */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            key="clear-all-btn"
                            aria-label="Limpar todos os filtros"
                            whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClearFilters}
                            className="text-sm text-gray-600 hover:text-gray-800 border border-gray-200 
                            rounded-lg hover:bg-gray-50 transition-colors
                            dark:bg-blue-200/20 dark:text-blue-200 dark:border-blue-200"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Limpar filtros
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );

}