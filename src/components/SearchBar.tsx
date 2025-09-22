'use client';

import { Search } from 'lucide-react';

type SearchBarProps = {
  value: string;
  genre: string;
  status: string;
  onChange: (val: string) => void;
};

export function SearchBar({ value, genre, status, onChange }: SearchBarProps) {
  const statusMap: Record<string, string> = {
    'to-read': 'Quero Ler',
    'reading': 'Lendo',
    'read': 'Lido',
    'paused': 'Pausado',
    'abandoned': 'Abandonado',
  };

  const displayStatus = status ? statusMap[status] || status : '';
  const displayGenre = genre || '';

  return (
    <div 
      className="relative w-full" 
      style={{ margin: '1rem' }}
    >
      {/* Container do input com ícone */}
      <div className="relative">
        {/* Ícone de busca fixo dentro do input */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input com padding correto para não sobrepor o ícone */}
        <input
          type="text"
          placeholder="Buscar por título, autor, ISBN..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
          style={{ 
            paddingLeft: '2.75rem', 
            paddingRight: value ? '2.5rem' : '1rem', 
            paddingTop: '0.75rem', 
            paddingBottom: '0.75rem' 
          }}
        />

        {/* Botão limpar busca */}
        {value && (
          <button
            onClick={() => onChange('')}
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
      {(value || displayGenre || displayStatus) && (
        <div 
          className="text-xs text-gray-500"
          style={{ marginTop: '0.5rem' }}
        >
          Buscando por:{" "}
          {value && `"${value}"`}
          {displayGenre && ` / "${displayGenre}"`}
          {displayStatus && ` / "${displayStatus}"`}
        </div>
      )}
    </div>
  );
}