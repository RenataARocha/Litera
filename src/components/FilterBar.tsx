'use client';

import { Search } from 'lucide-react';

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

    return (
        <div className="bg-white rounded-2xl shadow-lg" style={{
            paddingLeft: '0.9rem',
            paddingRight: '2.5rem',
            paddingTop: '0.5rem',
            paddingBottom: '1rem',
            marginBottom: '2rem'
        }}>
            {/* Barra de busca */}
            <div className="relative w-full" style={{ margin: '1rem' }}>
                <div className="relative">
                    {/* Ícone de busca */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Input de busca */}
                    <input
                        type="text"
                        placeholder="Buscar por título, autor, ISBN..."
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        className="w-full h-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
                        style={{
                            paddingLeft: '2.75rem',
                            paddingRight: query ? '2.5rem' : '1rem',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem'
                        }}
                    />

                    {/* Botão limpar busca */}
                    {query && (
                        <button
                            onClick={() => onQueryChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                            title="Limpar busca"
                            style={{ padding: '0.25rem' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Indicador de busca ativa */}
                {(query || genre || status) && (
                    <div className="text-xs text-gray-500" style={{ marginTop: '0.5rem' }}>
                        Buscando por:{" "}
                        {query && `"${query}"`}
                        {genre && ` / "${genre}"`}
                        {status && ` / "${status}"`}
                    </div>
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center" style={{ gap: '1rem', paddingLeft: '1rem' }}>
                {/* Filtro por gênero */}
                <div className="relative">
                    <select
                        className="w-full h-12 text-left cursor-pointer rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none transition-all duration-200 hover:border-gray-300"
                        value={genre}
                        onChange={(e) => onGenreChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
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
                    </select>

                    {/* Seta customizada */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Indicador de filtro ativo */}
                    {genre && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                </div>

                {/* Filtro por status */}
                <div className="relative">
                    <select
                        className="w-full h-12 text-left cursor-pointer rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] appearance-none transition-all duration-200 hover:border-gray-300"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                    >
                        <option value="">📊 Todos os Status</option>
                        <option value="não lido">📚 Não Lido</option>
                        <option value="quero ler">🎯 Quero Ler</option>
                        <option value="lendo">📖 Lendo</option>
                        <option value="lido">✅ Lido</option>
                        <option value="pausado">⏸️ Pausado</option>
                        <option value="abandonado">❌ Abandonado</option>
                    </select>

                    {/* Seta customizada */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Indicador de filtro ativo */}
                    {status && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                </div>

                {/* Botão para limpar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>
        </div>
    );
}