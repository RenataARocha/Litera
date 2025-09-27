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

    const clearButtonVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            x: -10
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    const badgeVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.2
            }
        }
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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                    <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        animate={{
                            scale: query ? 0.9 : 1,
                            color: query ? "#3b82f6" : "#9ca3af"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <Search className="w-5 h-5" />
                    </motion.div>

                    <motion.input
                        type="text"
                        placeholder="Buscar por título, autor, ISBN..."
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                title="Limpar busca"
                                style={{ padding: '0.25rem' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                        &quot;{query}&quot;
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
                                        Gênero: &quot;{genre}&quot;
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
                                        Status: &quot;{status}&quot;
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
                className="flex flex-wrap items-center"
                style={{ gap: '1rem', paddingLeft: '1rem' }}
            >
                {/* Filtro por gênero */}
                <div className="relative">
                    <motion.select
                        className="w-full h-12 text-left cursor-pointer rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none transition-all duration-200 hover:border-gray-300"
                        value={genre}
                        onChange={(e) => onGenreChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                        whileFocus={{
                            scale: 1.02,
                            borderColor: "#3b82f6"
                        }}
                        whileHover={{
                            borderColor: "#d1d5db"
                        }}
                    >
                        <option value="">🏷️ Todos os Gêneros</option>
                        <option value="Literatura Brasileira">📚 Literatura Brasileira</option>
                        <option value="Ficção Científica">🚀 Ficção Científica</option>
                        <option value="Realismo Mágico">✨ Realismo Mágico</option>
                        <option value="Ficção">📖 Ficção</option>
                        <option value="Fantasia">🐉 Fantasia</option>
                        <option value="Romance">💕 Romance</option>
                        <option value="Biografia">👤 Biografia</option>
                        <option value="História">🏛️ História</option>
                        <option value="Autoajuda">💪 Autoajuda</option>
                        <option value="Tecnologia">💻 Tecnologia</option>
                        <option value="Programação">⌨️ Programação</option>
                        <option value="Negócios">💼 Negócios</option>
                        <option value="Psicologia">🧠 Psicologia</option>
                        <option value="Filosofia">🤔 Filosofia</option>
                        <option value="Poesia">🎭 Poesia</option>
                    </motion.select>

                    <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        animate={{
                            rotate: genre ? 180 : 0,
                            color: genre ? "#3b82f6" : "#6b7280"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>

                    <AnimatePresence>
                        {genre && (
                            <motion.div
                                key="genre-badge"
                                variants={badgeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Filtro por status */}
                <div className="relative">
                    <motion.select
                        className="w-full h-12 text-left cursor-pointer rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none transition-all duration-200 hover:border-gray-300"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                        whileFocus={{
                            scale: 1.02,
                            borderColor: "#3b82f6"
                        }}
                        whileHover={{
                            borderColor: "#d1d5db"
                        }}
                    >
                        <option value="">📊 Todos os Status</option>
                        <option value="não lido">📚 Não Lido</option>
                        <option value="quero ler">🎯 Quero Ler</option>
                        <option value="lendo">📖 Lendo</option>
                        <option value="lido">✅ Lido</option>
                        <option value="pausado">⏸️ Pausado</option>
                        <option value="abandonado">❌ Abandonado</option>
                    </motion.select>

                    <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        animate={{
                            rotate: status ? 180 : 0,
                            color: status ? "#3b82f6" : "#6b7280"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>

                    <AnimatePresence>
                        {status && (
                            <motion.div
                                key="status-badge"
                                variants={badgeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Botão limpar filtros */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            key="clear-all-btn"
                            variants={clearButtonVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#f9fafb"
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={onClearFilters}
                            className="text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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