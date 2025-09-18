'use client';

import { Search } from 'lucide-react';

type SearchBarProps = {
    value: string;
    onChange: (val: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar por título ou autor..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
    );
}