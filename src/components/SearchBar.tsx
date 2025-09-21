'use client';

import { Search } from 'lucide-react';

type SearchBarProps = {
    value: string;
    onChange: (val: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="         Buscar por título, autor, ISBN..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className=" w-190 h-12 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
            />

            {/* Indicador de busca ativa */}
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

            {/* Contador de resultados (opcional) */}
            {value && (
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    Buscando por: "{value}"
                </div>
            )}
        </div>
    );
}