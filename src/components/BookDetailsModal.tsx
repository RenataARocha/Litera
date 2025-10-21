"use client";
import Image from "next/image";
import { Book } from "@/components/types/types";
import StarRating from "./StarRating";
import { useState } from "react";
import { Edit, Save, X } from "lucide-react";

type BookDetailsModalProps = {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    children?: React.ReactNode;
    onUpdate?: (updatedBook: Book) => void;
};

export default function BookDetailsModal({
    book,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onUpdate,
}: BookDetailsModalProps) {
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedNotes, setEditedNotes] = useState(book.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState('');

    if (!isOpen) return null;

    const bookWithPages = book as Book & {
        pages?: number;
        finishedPages?: number;
        publisher?: string;
        language?: string;
        readingDate?: string;
    };

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleSaveNotes = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/books/${book.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes: editedNotes })
            });

            if (!res.ok) throw new Error('Erro ao salvar');

            const updatedBook = await res.json();

            if (onUpdate) {
                onUpdate(updatedBook);
            }

            showFeedback('✅ Anotações salvas com sucesso!');
            setIsEditingNotes(false);
        } catch (error) {
            console.error(error);
            showFeedback('❌ Erro ao salvar anotações');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedNotes(book.notes || '');
        setIsEditingNotes(false);
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 wood:bg-background/50 dark:bg-black/50 flex items-center justify-center z-50"
            style={{ padding: "1rem" }}
        >
            <div
                className="bg-blue-50 dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl wood:bg-[var(--color-secondary-800)]"
                style={{ margin: "1rem" }}
            >

                {/* Header com botão fechar */}
                <div className="flex justify-end" style={{ padding: "1.5rem 1.5rem 0 1.5rem" }}>
                    <button
                        onClick={onClose}
                        className="text-[#8b6f47]/ dark:text-blue-200 cursor-pointer hover:text-[#6d5636] transition-colors wood:text-[var(--color-accent-500)]"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={{ padding: "0 2rem 2rem 2rem" }}>
                    {/* Capa e Informações Principais */}
                    <div className="flex gap-6 flex-col sm:flex-row items-start" style={{ marginBottom: "1.5rem" }}>
                        {book.cover && (
                            <div className="flex-shrink-0">
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    width={160}
                                    height={240}
                                    className="object-cover rounded-lg shadow-xl border-4 border-white/40 dark:border-slate-700"
                                />
                            </div>
                        )}

                        <div className="flex-1 w-full">
                            <h3
                                className="text-2xl font-bold text-[#3d2f1f] dark:text-blue-300 wood:text-[var(--color-primary-100)]"
                                style={{ marginBottom: "0.5rem" }}
                            >
                                {book.title}
                            </h3>
                            <p
                                className="text-base text-[#5d4d3d] dark:text-blue-200 wood:text-[var(--color-primary-200)]"
                                style={{ marginBottom: "1rem" }}
                            >
                                {book.author}
                            </p>

                            <div style={{ marginBottom: "1rem" }}>
                                <StarRating rating={book.rating} />
                                <span className="text-xs text-[#5d4d3d] dark:text-blue-300 wood:text-primary-500" style={{ marginLeft: "0.5rem" }}>
                                    ({book.rating}/5)
                                </span>
                            </div>

                            {/* Grid de Informações - Layout igual à imagem */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm" style={{ marginBottom: "1.5rem" }}>
                                <div>
                                    <p className="text-xs text-[#5d4d3d] dark:text-blue-300 wood:text-primary-500">Ano:</p>
                                    <p className="font-semibold text-[#3d2f1f] dark:text-blue-200 wood:text-[var(--color-primary-100)]">
                                        {book.year || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5d4d3d] dark:text-blue-300 wood:text-primary-500">Páginas:</p>
                                    <p className="font-semibold text-[#3d2f1f] dark:text-blue-200 wood:text-[var(--color-primary-100)]">
                                        {bookWithPages.pages || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5d4d3d] dark:text-blue-300 wood:text-primary-500">Gênero:</p>
                                    <p className="font-semibold text-[#3d2f1f] dark:text-blue-200 wood:text-[var(--color-primary-100)]">
                                        {book.genre || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5d4d3d] dark:text-blue-300 wood:text-primary-500">Status:</p>
                                    {book.status && (
                                        <span className="inline-block bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium wood:bg-[var(--color-accent-200)] wood:text-[var(--color-accent-800)]" style={{ padding: "0.25rem 0.75rem", marginTop: "0.25rem" }}>
                                            {book.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Botões Editar (Azul) e Excluir (Vermelho) */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onEdit}
                                    className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 wood:bg-[var(--color-primary-800)] wood:hover:bg-[var(--color-primary-900)]"
                                    style={{ padding: "0.75rem 1rem" }}
                                >
                                    Editar Livro
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 wood:bg-[var(--color-accent-700)] wood:hover:bg-[var(--color-accent-800)]"
                                    style={{ padding: "0.75rem 1rem" }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Sinopse com Scroll */}
                    {book.description && (
                        <div
                            className="bg-violet-200/100 dark:bg-slate-700 rounded-xl wood:bg-accent-200/80"
                            style={{ padding: "1.25rem", marginBottom: "1rem" }}
                        >
                            <h4
                                className="text-base font-semibold text-violet-800 dark:text-blue-300 wood:text-[var(--color-primary-900)] flex items-center gap-2"
                                style={{ marginBottom: "0.75rem" }}
                            >
                                📚 Sinopse
                            </h4>
                            <div
                                className="text-sm text-[#4d3d2d] dark:text-blue-200 wood:text-[var(--color-primary-900)] leading-relaxed overflow-y-auto"
                                style={{ maxHeight: "150px", padding: '1rem' }}
                            >
                                {book.description}
                            </div>
                        </div>
                    )}

                    {/* Anotações da Leitura */}
                    {(book.notes && book.notes.trim() !== '') || isEditingNotes ? (
                        <div
                            className="bg-emerald-100 dark:bg-amber-900/20 rounded-xl wood:bg-[var(--color-secondary-600)]"
                            style={{ padding: "1.25rem", marginBottom: "1rem" }}
                        >
                            <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem" }}>
                                <h4 className="text-base font-semibold text-emerald-800 dark:text-amber-300 wood:text-[var(--color-primary-900)] flex items-center gap-2">
                                    ✍️ Anotações da Leitura
                                </h4>
                                {!isEditingNotes ? (
                                    <button
                                        onClick={() => {
                                            setIsEditingNotes(true);
                                            setEditedNotes(book.notes || '');
                                        }}
                                        className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors dark:bg-emerald-500 wood:bg-secondary-600"
                                        style={{ padding: '0.4rem 0.8rem' }}
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                        Editar
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveNotes}
                                            disabled={isSaving}
                                            className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                            style={{ padding: '0.4rem 0.8rem' }}
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            {isSaving ? 'Salvando...' : 'Salvar'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="flex items-center gap-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                            style={{ padding: '0.4rem 0.8rem' }}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditingNotes ? (
                                <textarea
                                    value={editedNotes}
                                    onChange={(e) => setEditedNotes(e.target.value)}
                                    className="w-full border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-100 wood:bg-primary-800/50 wood:border-primary-600 wood:text-primary-100"
                                    style={{ padding: '0.75rem', minHeight: '200px' }}
                                    placeholder="Escreva suas anotações sobre o livro..."
                                />
                            ) : (
                                <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 dark:scrollbar-thumb-amber-500 dark:scrollbar-track-amber-900/20 wood:scrollbar-thumb-primary-500 wood:scrollbar-track-primary-800" style={{ paddingRight: '0.5rem' }}>
                                    {book.notes && book.notes.includes('NOTAS PESSOAIS:') && book.notes.includes('ANOTAÇÕES DA LEITURA:') ? (
                                        // Renderiza com seções separadas
                                        <div className="space-y-4">
                                            {book.notes.split(/={50,}/g).map((section, sectionIndex) => {
                                                if (section.includes('NOTAS PESSOAIS:')) {
                                                    const personalNote = section.replace('📝 NOTAS PESSOAIS:', '').trim();
                                                    return (
                                                        <div key={`personal-${sectionIndex}`} className="bg-blue-50/80 dark:bg-blue-900/20 rounded-lg wood:bg-blue-700/20" style={{ padding: '0.75rem' }}>
                                                            <h5 className="text-xs font-semibold text-blue-700 dark:text-blue-300 wood:text-blue-400 flex items-center gap-1" style={{ marginBottom: '0.5rem' }}>
                                                                📝 Notas Pessoais
                                                            </h5>
                                                            <p className="text-sm text-[#4d3d2d] dark:text-amber-100 wood:text-primary-100 leading-relaxed whitespace-pre-wrap">
                                                                {personalNote}
                                                            </p>
                                                        </div>
                                                    );
                                                } else if (section.includes('ANOTAÇÕES DA LEITURA:')) {
                                                    const readingNotes = section.replace('📖 ANOTAÇÕES DA LEITURA:', '').trim();
                                                    return (
                                                        <div key={`reading-${sectionIndex}`}>
                                                            <h5 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 wood:text-emerald-400 flex items-center gap-1" style={{ marginBottom: '0.75rem' }}>
                                                                📖 Anotações Durante a Leitura
                                                            </h5>
                                                            <div className="space-y-3">
                                                                {readingNotes.split('\n\n---\n\n').map((note, index) => {
                                                                    const match = note.match(/\[(.*?)\]\s*([\s\S]*)/);
                                                                    if (match) {
                                                                        const [, date, content] = match;
                                                                        return (
                                                                            <div key={index} className="bg-white/60 dark:bg-amber-800/30 rounded-lg wood:bg-primary-700/40" style={{ padding: '0.75rem' }}>
                                                                                <div className="flex items-center gap-2" style={{ marginBottom: '0.4rem' }}>
                                                                                    <span className="text-xs font-medium text-emerald-600 dark:text-amber-400 wood:text-accent-400">
                                                                                        📅 {date}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm text-[#4d3d2d] dark:text-amber-100 wood:text-primary-100 leading-relaxed">
                                                                                    {content.trim()}
                                                                                </p>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    ) : book.notes ? (
                                        // Renderiza normalmente (só um tipo de anotação)
                                        <div className="space-y-3">
                                            {book.notes.split('\n\n---\n\n').map((note, index) => {
                                                const match = note.match(/\[(.*?)\]\s*([\s\S]*)/);
                                                if (match) {
                                                    const [, date, content] = match;
                                                    return (
                                                        <div key={index} className="bg-white/60 dark:bg-amber-800/30 rounded-lg wood:bg-primary-700/40" style={{ padding: '0.75rem' }}>
                                                            <div className="flex items-center gap-2" style={{ marginBottom: '0.4rem' }}>
                                                                <span className="text-xs font-medium text-emerald-600 dark:text-amber-400 wood:text-accent-400">
                                                                    📅 {date}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-[#4d3d2d] dark:text-amber-100 wood:text-primary-100 leading-relaxed">
                                                                {content.trim()}
                                                            </p>
                                                        </div>
                                                    );
                                                } else {
                                                    // Texto sem data (nota pessoal simples)
                                                    return (
                                                        <div key={index} className="bg-white/60 dark:bg-amber-800/30 rounded-lg wood:bg-primary-700/40" style={{ padding: '0.75rem' }}>
                                                            <p className="text-sm text-[#4d3d2d] dark:text-amber-100 wood:text-primary-100 leading-relaxed whitespace-pre-wrap">
                                                                {note.trim()}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Informações Técnicas */}
                    <div
                        className="bg-fuchsia-100 dark:bg-slate-700 rounded-xl wood:bg-[var(--color-primary-600)]"
                        style={{ padding: "1.25rem", marginBottom: "1.5rem" }}
                    >
                        <h4
                            className="text-base font-semibold text-fuchsia-800 dark:text-blue-300 wood:text-[var(--color-primary-900)] flex items-center gap-2"
                            style={{ marginBottom: "0.75rem" }}
                        >
                            ⚙️ Informações Técnicas
                        </h4>
                        <div className="text-sm text-[#4d3d2d] dark:text-blue-200 wood:text-[var(--color-primary-900)]">
                            {book.isbn && (
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                            )}
                            {bookWithPages.publisher && (
                                <p style={{ marginTop: "0.25rem" }}><strong>Editora:</strong> {bookWithPages.publisher}</p>
                            )}
                            {bookWithPages.language && (
                                <p style={{ marginTop: "0.25rem" }}><strong>Idioma:</strong> {bookWithPages.language}</p>
                            )}
                            {bookWithPages.readingDate && (
                                <p style={{ marginTop: "0.25rem" }}><strong>Data de leitura:</strong> {bookWithPages.readingDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Botão Fechar */}
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-[#e8dcc8] hover:bg-[#d8ccb8] dark:bg-slate-600 dark:hover:bg-slate-500 text-[#3d2f1f] dark:text-white font-medium rounded-lg cursor-pointer transition-colors wood:bg-[var(--color-primary-300)] wood:hover:bg-[var(--color-primary-400)] wood:text-[var(--color-primary-900)]"
                            style={{ padding: "0.75rem 3rem" }}
                        >
                            Fechar
                        </button>
                    </div>

                    {/* Feedback de salvamento */}
                    {feedback && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white rounded-lg shadow-lg z-50 font-medium animate-slideInRight" style={{ padding: '14px 18px' }}>
                            {feedback}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from { 
                        opacity: 0; 
                        transform: translateX(100px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </div>
    );
}