'use client';
import { useState, useEffect } from "react";

type PersonalNotesProps = {
    bookId?: number;
    initialNotes?: string; // <-- nova prop
    placeholder?: string;
};

export default function PersonalNotes({
    bookId,
    initialNotes = "",
    placeholder = "Escreva suas notas pessoais..."
}: PersonalNotesProps) {
    const [notes, setNotes] = useState("");
    const storageKey = bookId ? `personalNotes_${bookId}` : "personalNotes";

    useEffect(() => {
        const savedNotes = localStorage.getItem(storageKey);
        if (savedNotes) {
            setNotes(savedNotes);
        } else if (initialNotes) {
            setNotes(initialNotes);
        }
    }, [storageKey, initialNotes]);

    useEffect(() => {
        if (notes) {
            localStorage.setItem(storageKey, notes);
        }
    }, [notes, storageKey]);

    return (
        <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ padding: '0.7rem' }}
            placeholder={placeholder}
        />
    );
}
