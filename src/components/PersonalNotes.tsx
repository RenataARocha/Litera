'use client';
import { useState, useEffect } from "react";

type PersonalNotesProps = {
    bookId?: number;
    initialNotes?: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

export default function PersonalNotes({
    initialNotes = "",
    placeholder = "Escreva suas notas pessoais...",
    onChange
}: PersonalNotesProps) {
    const [notes, setNotes] = useState(initialNotes);

    // Atualiza o estado local quando initialNotes mudar (quando o livro mudar)
    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    // Notifica o componente pai quando as notas mudarem
    const handleChange = (value: string) => {
        setNotes(value);
        onChange(value);
    };

    return (
        <textarea
            rows={4}
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
            dark:bg-slate-800/80 
            dark:text-blue-100 
            dark:placeholder-blue-300/60 
            dark:border-blue-400
            wood:bg-white/80
            wood:text-primary-900
            wood:focus:ring-2 wood:focus:ring-primary-200"
            style={{ padding: '0.7rem' }}
            placeholder={placeholder}
        />
    );
}