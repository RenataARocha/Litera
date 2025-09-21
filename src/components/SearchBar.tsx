'use client';

import { Search } from 'lucide-react';

type SearchBarProps = {
  value: string;
  genre: string;
  status: string;
  onChange: (val: string) => void;
};

export function SearchBar({ value, genre, status, onChange }: SearchBarProps) {
  // Função para traduzir status do inglês para português
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
    <div className="relative w-full h-22 -bottom-5 -right-5">
      <div className="absolute left-3 top-6 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="          Buscar por título, autor, ISBN..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-190 h-12 pl-10 pr-4 py-3 justify-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
      />

      {/* Botão limpar busca */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Limpar busca"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Indicador de busca ativa */}
      {(value || displayGenre || displayStatus) && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          Buscando por:{" "}
          {value && `"${value}"`}
          {displayGenre && ` / "${displayGenre}"`}
          {displayStatus && ` / "${displayStatus}"`}
        </div>
      )}
    </div>
  );
}
