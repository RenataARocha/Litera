'use client';

import { Filter } from 'lucide-react';

type GenreFilterProps = {
  genres: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function GenreFilter({ genres, value, onChange }: GenreFilterProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Filter className="w-4 h-4 text-gray-400" />
      </div>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 min-w-[180px] appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300"
      >
        <option value="">Todos os Gêneros</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      
      {/* Seta customizada */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Indicador de filtro ativo */}
      {value && (
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}