"use client";

import { Search } from "lucide-react";
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
    onClearFilters,
}: FilterBarProps) {
    const hasActiveFilters = query || genre || status;

    // Variantes de animação do Container
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: -20, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    // Variantes de animação dos Itens
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: -15, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
    };

    const searchInfoVariants: Variants = {
        hidden: { opacity: 0, height: 0, y: -10 },
        visible: {
            opacity: 1,
            height: "auto",
            y: 0,
            transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        },
        exit: {
            opacity: 0,
            height: 0,
            y: -10,
            transition: { duration: 0.2 },
        },
    };

    const filterTextVariants: Variants = {
        hidden: { opacity: 0, x: -5 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 5 },
    };


    return (
        <motion.div
            role="search"
            aria-label="Busca e filtros de livros"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="
  bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 
  dark:bg-blue-200/20 dark:group-hover:bg-blue-200/20 
  wood:bg-primary-900 wood:shadow-[0_4px_10px_rgba(251,121,36,0.6)] 
  wood:hover:shadow-[0_6px_20px_rgba(251,121,36,0.6)]
"
            style={{
                paddingLeft: "0.9rem",
                paddingRight: "2.5rem",
                paddingTop: "0.5rem",
                paddingBottom: "1rem",
                marginBottom: "2rem",
            }}
        >
            {/* Barra de busca */}
            <motion.div
                variants={itemVariants}
                className="relative w-full"
                style={{ margin: "1rem" }}
            >
                <div className="relative">
                    <label htmlFor="search-books" className="sr-only">
                        Buscar livros por título, autor ou ISBN
                    </label>

                    <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        animate={{
                            scale: query ? 0.9 : 1,
                            color: query ? "#3b82f6" : "#9ca3af",
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <Search
                            className="w-5 h-5 wood:text-accent-500"
                            aria-hidden="true"
                        />
                    </motion.div>

                    <motion.input
                        id="search-books"
                        type="text"
                        placeholder="Buscar por título, autor, ISBN..."
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        aria-label="Campo de busca"
                        className="
  w-full h-12 rounded-xl 
  border border-gray-200 dark:border-blue-200/20
  bg-white dark:bg-slate-800/20 dark:hover:border-[#3b82f6]
  text-gray-700 dark:text-blue-200
  placeholder-gray-400 dark:placeholder-blue-200
  wood:bg-primary-800 wood:border-accent-700
  wood:text-foreground wood:placeholder-secondary-400
  focus:outline-none focus:ring-2 focus:ring-blue-500
  wood:focus:ring-accent-600
  transition-all duration-300
"
                        style={{
                            paddingLeft: "2.75rem",
                            paddingRight: query ? "2.5rem" : "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                        }}
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
                                onClick={() => onQueryChange("")}
                                aria-label="Limpar campo de busca"
                                className="
  absolute right-3 top-1/2 -translate-y-1/2
  text-gray-400 hover:text-gray-600
  dark:hover:text-blue-400
  wood:text-foreground wood:hover:text-accent-500
  transition-colors z-10
"
                                style={{ padding: "0.25rem" }}
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
                            className="text-xs flex flex-wrap items-center text-gray-500 wood:text-foreground"
                            style={{ marginTop: "0.5rem" }}
                            role="status"
                            aria-live="polite"
                        >
                            Buscando por:{" "}
                            {query && (
                                <motion.span
                                    key="query-text"
                                    variants={filterTextVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="font-medium ml-1 mr-2"
                                >
                                    &quot;{query}&quot;
                                </motion.span>
                            )}
                            {genre && (
                                <motion.span
                                    key="genre-text"
                                    variants={filterTextVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="font-medium ml-1 mr-2"
                                >
                                    Gênero: &quot;{genre}&quot;
                                </motion.span>
                            )}
                            {status && (
                                <motion.span
                                    key="status-text"
                                    variants={filterTextVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="font-medium ml-1 mr-2"
                                >
                                    Status: &quot;{status}&quot;
                                </motion.span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Filtros */}
            <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center"
                style={{ gap: "1rem", paddingLeft: "1rem" }}
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
                        className="
  w-full h-12 cursor-pointer rounded-xl border border-gray-200 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  bg-white text-gray-700 min-w-[160px] appearance-none 
  transition-all duration-200 hover:border-gray-300 

  dark:bg-blue-200/20 dark:text-blue-200 dark:border-transparent dark:hover:border-[#3b82f6]

  wood:bg-primary-800 
 wood:border-transparent
  wood:text-primary-200 
  wood:hover:border-accent-600 
  wood:focus:ring-accent-700
  
"
                        value={genre}
                        onChange={(e) => onGenreChange(e.target.value)}
                        style={{ paddingLeft: "1rem", paddingRight: "2.5rem" }}
                    >
                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="">Selecione uma categoria</option>

                        {/* 📚 FICÇÃO */}
                        <optgroup label="📚 FICÇÃO" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Literatura Brasileira">📚 Literatura Brasileira</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção">📖 Ficção</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção Científica">🚀 Ficção Científica</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fantasia">🐉 Fantasia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Realismo Mágico">✨ Realismo Mágico</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Distopia">🌆 Distopia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Steampunk/Cyberpunk">⚙️ Steampunk/Cyberpunk</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Romance">💕 Romance</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Romance Histórico">💕📜 Romance Histórico</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Terror">👻 Terror</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Suspense">🕵️‍♀️ Suspense</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Mistério">🧩 Mistério</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Thriller">🔪 Thriller</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Crime/Policial">🚔 Crime/Policial</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Paranormal">👁️ Paranormal</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Drama">🎬 Drama</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Aventura">🏔️ Aventura</option>
                        </optgroup>

                        {/* 📖 LITERATURA ESPECÍFICA */}
                        <optgroup label="📖 LITERATURA" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Clássicos">🏺 Clássicos</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Poesia">🎭 Poesia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Contos">📜 Contos</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Crônicas">📝 Crônicas</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ensaios">📚 Ensaios</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Antologias">📖 Antologias</option>
                        </optgroup>

                        {/* 👥 NÃO-FICÇÃO */}
                        <optgroup label="👥 NÃO-FICÇÃO" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Biografia">👤 Biografia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Memórias">🕰️ Memórias</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cartas e Diários">✉️ Cartas e Diários</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="História">🏛️ História</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="True Crime">🔍 True Crime</option>
                        </optgroup>

                        {/* 🧠 DESENVOLVIMENTO PESSOAL */}
                        <optgroup label="🧠 DESENVOLVIMENTO PESSOAL" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Autoajuda">💪 Autoajuda</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Desenvolvimento Pessoal">🌟 Desenvolvimento Pessoal</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Psicologia">🧠 Psicologia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Filosofia">🤔 Filosofia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Espiritualidade">🌙 Espiritualidade</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Religião">🙏 Religião</option>
                        </optgroup>

                        {/* 💼 NEGÓCIOS E CARREIRA */}
                        <optgroup label="💼 NEGÓCIOS E CARREIRA" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Negócios">💼 Negócios</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Empreendedorismo">🚀 Empreendedorismo</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Marketing/Vendas">📈 Marketing/Vendas</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Economia">💰 Economia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Finanças Pessoais">💸 Finanças Pessoais</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Direito">⚖️ Direito</option>
                        </optgroup>

                        {/* 💻 TECNOLOGIA */}
                        <optgroup label="💻 TECNOLOGIA" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Tecnologia">💻 Tecnologia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Programação">⌨️ Programação</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Games">🎮 Games</option>
                        </optgroup>

                        {/* 🔬 CIÊNCIAS */}
                        <optgroup label="🔬 CIÊNCIAS" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ciência">🔬 Ciência</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Matemática">📏 Matemática</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Astronomia">🌌 Astronomia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Saúde">🩺 Saúde</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Nutrição">🥗 Nutrição</option>
                        </optgroup>

                        {/* 🎨 ARTES E CULTURA */}
                        <optgroup label="🎨 ARTES E CULTURA" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Artes">🎨 Artes</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Música">🎵 Música</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cinema e TV">📺 Cinema e TV</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fotografia">📸 Fotografia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Moda">👗 Moda</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Beleza">💅 Beleza</option>
                        </optgroup>

                        {/* 📚 QUADRINHOS E GRAPHIC NOVELS */}
                        <optgroup label="📚 QUADRINHOS" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="HQs e Mangás">🦸 HQs e Mangás</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Quadrinhos Nacionais">🇧🇷 Quadrinhos Nacionais</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Graphic Novels">🎨📖 Graphic Novels</option>
                        </optgroup>

                        {/* 👶 PÚBLICO JOVEM */}
                        <optgroup label="👶 PÚBLICO JOVEM" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Infantil">🧸 Infantil</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Juvenil">🎒 Juvenil</option>
                        </optgroup>

                        {/* 🌍 SOCIEDADE E MEIO AMBIENTE */}
                        <optgroup label="🌍 SOCIEDADE" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Política">🏛️ Política</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Sociologia">🌍 Sociologia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ecologia">🌱 Ecologia</option>
                        </optgroup>

                        {/* 🏗️ ÁREAS TÉCNICAS */}
                        <optgroup label="🏗️ ÁREAS TÉCNICAS" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Arquitetura">🏗️ Arquitetura</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Engenharia">🧱 Engenharia</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Educação">📘 Educação</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Didáticos">📗 Didáticos</option>
                        </optgroup>

                        {/* 🎭 LIFESTYLE */}
                        <optgroup label="🎭 LIFESTYLE" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Culinária">🍳 Culinária</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Viagens">✈️ Viagens</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Esportes">⚽ Esportes</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Jardinagem">🌻 Jardinagem</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Pets/Animais">🐾 Pets/Animais</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Humor">😂 Humor</option>
                        </optgroup>

                        {/* 🎭 TEMAS ESPECIAIS */}
                        <optgroup label="🎭 TEMAS ESPECIAIS" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Erótico">🔥 Erótico</option>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="LGBTQIA+">🏳️‍🌈 LGBTQIA+</option>
                        </optgroup>

                        {/* 📘 OUTROS */}
                        <optgroup label="📘 OUTROS" className='dark:text-blue-900'>
                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Outros">📘 Outros</option>
                        </optgroup>

                    </motion.select>


                    {/* Ícone da setinha customizado */}
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                            className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-accent-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>

                {/* Filtro por status */}
                <div className="relative">
                    <label htmlFor="status-filter" className="sr-only">
                        Filtrar por status de leitura
                    </label>
                    <motion.select
                        id="status-filter"
                        aria-label="Filtro de status"
                        className="
  w-full h-12 cursor-pointer rounded-xl border border-gray-200 focus:outline-none 
  focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none 
  transition-all duration-200 hover:border-gray-300 
  dark:hover:border-[#3b82f6] dark:bg-blue-200/20 dark:text-blue-200 dark:border-transparent 
  
  wood:bg-primary-800 
  wood:border-transparent 
  wood:text-primary-200 
  wood:hover:border-accent-600 
  wood:focus:ring-accent-700
"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{ paddingLeft: "1rem", paddingRight: "2.5rem" }}
                    >
                        <option value="">Todos os Status 📊</option >
                        <option value="não lido">Não Lido 📚</option >
                        <option value="quero ler">Quero Ler 🎯</option >
                        <option value="lendo">Lendo 📖</option >
                        <option value="lido">Lido ✅</option >
                        <option value="pausado">Pausado ⏸️</option >
                        <option value="abandonado">Abandonado ❌</option >
                    </motion.select>

                    {/* Ícone da setinha customizado */}
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                            className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-accent-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>

                {/* Botão limpar filtros */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            key="clear-all-btn"
                            aria-label="Limpar todos os filtros"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClearFilters}
                            className="
    text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-2
    hover:bg-gray-50
    dark:text-blue-200 dark:border-blue-200/20 dark:hover:bg-blue-200/20 dark:hover:text-blue-100
    wood:text-foreground wood:border-accent-800 
    wood:hover:bg-accent-900 wood:hover:text-primary-50
  "
                            style={{ padding: "0.5rem 1rem" }}
                        >
                            Limpar filtros
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}