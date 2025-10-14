"use client";
import Image from "next/image";
import { Book } from "@/components/types/types";
import StarRating from "./StarRating";

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
}: BookDetailsModalProps) {
    if (!isOpen) return null;

    const bookWithPages = book as Book & {
        pages?: number;
        finishedPages?: number;
        publisher?: string;
        language?: string;
        readingDate?: string;
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

                    {/* Cronômetro de Leitura */}
                    <div
                        className="bg-orange-50 dark:bg-slate-700 rounded-xl wood:bg-[var(--color-secondary-600)]"
                        style={{ padding: "1.25rem", marginBottom: "1rem" }}
                    >
                        <h4
                            className="text-base font-semibold text-orange-700 dark:text-orange-300 wood:text-[var(--color-accent-900)] flex items-center gap-2"
                            style={{ marginBottom: "1rem" }}
                        >
                            ⏱️ Cronômetro de Leitura
                        </h4>

                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-3xl font-mono font-bold text-orange-700 dark:text-orange-300 wood:text-[var(--color-accent-500)]">
                                    00:00:00
                                </div>
                                <p
                                    className="text-xs text-orange-600 dark:text-orange-400 wood:text-[var(--color-accent-900)]"
                                    style={{ marginTop: "0.25rem" }}
                                >
                                    Pausado
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-blue-300 wood:text-[var(--color-accent-900)]">Sessão</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-blue-100 wood:text-[var(--color-accent-500)]">0min</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-blue-300 wood:text-[var(--color-accent-900)]">Total</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-blue-100 wood:text-[var(--color-accent-500)]">0h 0m</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded cursor-pointer transition-colors wood:bg-green-700 wood:hover:bg-green-800 flex items-center justify-center gap-1"
                                    style={{ padding: "0.5rem 1rem" }}
                                >
                                    ▶ Iniciar
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded cursor-pointer transition-colors wood:bg-blue-600 wood:hover:bg-blue-700 flex items-center justify-center gap-1"
                                    style={{ padding: "0.5rem 1rem" }}
                                >
                                    🔄 Reset
                                </button>
                            </div>
                        </div>
                        <p className="text-xs italic text-center text-gray-600 dark:text-blue-300 wood:text-[var(--color-accent-900)]" style={{ marginTop: "1rem" }}>
                            &quot;A leitura é uma conversa com as mentes mais nobres dos séculos passados.&quot;
                        </p>
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

                    {/* Notas Pessoais */}
                    {book.notes && (
                        <div
                            className="bg-emerald-100 dark:bg-amber-900/20 rounded-xl wood:bg-[var(--color-secondary-600)]"
                            style={{ padding: "1.25rem", marginBottom: "1rem" }}
                        >
                            <h4
                                className="text-base font-semibold text-emerald-800 dark:text-amber-300 wood:text-[var(--color-primary-900)] flex items-center gap-2"
                                style={{ marginBottom: "0.75rem" }}
                            >
                                ✍️ Notas Pessoais
                            </h4>
                            <p className="text-sm text-[#4d3d2d] dark:text-amber-200 wood:text-[var(--color-primary-200)] leading-relaxed whitespace-pre-wrap">
                                {book.notes}
                            </p>
                        </div>
                    )}

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
                </div>
            </div>
        </div>
    );
}