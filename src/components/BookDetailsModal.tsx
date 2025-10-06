"use client";
import Image from "next/image";
import { Book } from "@/components/types/types";
import StarRating from "./StarRating";
import Timer from "./TimerBook";

type BookDetailsModalProps = {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function BookDetailsModal({
    book,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: BookDetailsModalProps) {
    if (!isOpen) return null;

    const getStatusConfig = (status: string) => {
        const configs = {
            lido: {
                text: "Lido",
                bgColor: "bg-green-100",
                textColor: "text-green-700",
                woodBg: "wood:bg-accent-200",
                woodText: "wood:text-primary-900",
            },
            lendo: {
                text: "Lendo",
                bgColor: "bg-blue-100",
                textColor: "text-blue-700",
                woodBg: "wood:bg-primary-300",
                woodText: "wood:text-primary-900",
            },
            pausado: {
                text: "Pausado",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-700",
                woodBg: "wood:bg-accent-300",
                woodText: "wood:text-primary-900",
            },
            "quero ler": {
                text: "Quero Ler",
                bgColor: "bg-purple-100",
                textColor: "text-purple-700",
                woodBg: "wood:bg-secondary-300",
                woodText: "wood:text-primary-900",
            },
            abandonado: {
                text: "Abandonado",
                bgColor: "bg-red-100",
                textColor: "text-red-700",
                woodBg: "wood:bg-secondary-400",
                woodText: "wood:text-primary-900",
            },
        };
        const normalizedStatus = status.toLowerCase();
        return (
            configs[normalizedStatus as keyof typeof configs] || configs["abandonado"]
        );
    };

    const statusConfig = getStatusConfig(book.status);

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 wood:bg-background/50 flex items-center justify-center z-50">
            <div className="bg-blue-50 dark:bg-slate-800 wood:bg-accent-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl wood:shadow-[0_8px_30px_rgba(154,110,60,0.4)]">
                <div>
                    {/* Header com botão fechar */}
                    <div style={{ margin: "1rem" }}>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 wood:text-secondary-200 wood:hover:text-primary-900 transition-colors cursor-pointer"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Seção superior: Capa e Informações lado a lado */}
                    <div
                        className="flex gap-6 bg-blue-100 dark:bg-blue-200/10 dark:border dark:border-blue-400 wood:bg-accent-200 wood:border-primary-300 rounded-lg"
                        style={{ padding: "2rem", margin: "1rem", marginBottom: "1.5rem" }}
                    >
                        {/* Capa do livro */}
                        <div className="flex-shrink-0">
                            {book.cover ? (
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    width={150}
                                    height={200}
                                    className="rounded-lg shadow-lg wood:shadow-[0_4px_10px_rgba(154,110,60,0.3)]"
                                />
                            ) : (
                                <div className="w-[150px] h-[200px] bg-gray-100 wood:bg-secondary-200 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-gray-400 wood:text-secondary-600"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Informações do livro */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                <div>
                                    <h3
                                        className="font-bold text-xl text-gray-900 dark:text-blue-600 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-blue-400 wood:text-primary-700 text-lg font-medium">
                                        {book.author}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <StarRating rating={book.rating} showNumber />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-blue-300 wood:text-primary-800">
                                            Ano:
                                        </span>
                                        <p className="text-gray-600 dark:text-blue-200 wood:text-primary-700">
                                            {book.year}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-blue-300 wood:text-primary-800">
                                            Páginas:
                                        </span>
                                        <p className="text-gray-600 dark:text-blue-200 wood:text-primary-700">
                                            {book.pages}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-blue-300 wood:text-primary-800">
                                            Gênero:
                                        </span>
                                        <p className="text-gray-600 dark:text-blue-200 wood:text-primary-700">
                                            {book.genre}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-blue-300 wood:text-primary-800">
                                            Status:
                                        </span>
                                        <span
                                            className={`inline-block rounded-full dark:bg-blue-200 text-xs ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.woodBg} ${statusConfig.woodText}`}
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                marginLeft: "0.25rem",
                                            }}
                                        >
                                            {statusConfig.text}
                                        </span>
                                    </div>
                                </div>

                                {/* Botões de ação */}
                                <div
                                    className="rounded-lg"
                                    style={{ padding: "1rem", marginTop: "1rem" }}
                                >
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onEdit}
                                            className="flex-1 cursor-pointer 
    bg-blue-600 text-white rounded-md hover:bg-blue-700 
    transition-colors flex items-center justify-center gap-2
    wood:bg-primary-700 wood:text-accent-100 wood:hover:bg-primary-800"
                                            style={{
                                                padding: "0.5rem 1rem",
                                                height: "2rem",
                                                marginTop: "1rem",
                                            }}
                                        >
                                            Editar Livro
                                        </button>

                                        <button
                                            onClick={onDelete}
                                            className="flex-1 cursor-pointer 
    bg-red-600 text-white rounded-lg hover:bg-red-700 
    transition-colors flex items-center justify-center gap-2
    wood:bg-secondary-700 wood:text-accent-100 wood:hover:bg-secondary-800"
                                            style={{
                                                padding: "0.5rem 1rem",
                                                height: "2rem",
                                                marginTop: "1rem",
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                    <Timer bookId={book.id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seções de conteúdo */}
                    <div
                        className="bg-white/50 dark:bg-blue-400/10 dark:border dark:border-blue-400 wood:bg-primary-600 wood:border-secondary-300 rounded-lg"
                        style={{ padding: "1rem", margin: "1rem" }}
                    >
                        {/* Sinopse */}
                        <div
                            className="bg-violet-100 dark:bg-violet-100/20 wood:bg-primary-200 rounded-lg"
                            style={{ padding: "1rem", marginBottom: "1rem" }}
                        >
                            <div
                                className="flex items-center gap-2"
                                style={{ marginBottom: "0.7rem" }}
                            >
                                <svg
                                    className="w-5 h-5 text-purple-600 dark:text-purple-400 wood:text-primary-800"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                <h4 className="font-semibold text-purple-800 dark:text-purple-400 wood:text-primary-900 text-lg">
                                    Sinopse
                                </h4>
                            </div>
                            <p className="text-black text-sm dark:text-blue-200 wood:text-primary-800 leading-relaxed">
                                {book.description}
                            </p>
                        </div>

                        {/* Notas Pessoais */}
                        <div
                            className="bg-green-100 dark:bg-green-100/20 wood:bg-accent-200 rounded-lg"
                            style={{ padding: "1rem", marginBottom: "1rem" }}
                        >
                            <div
                                className="flex items-center gap-2"
                                style={{ marginBottom: "0.7rem" }}
                            >
                                <svg
                                    className="w-5 h-5 text-green-600 dark:text-green-400 wood:text-accent-800"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                                <h4 className="font-semibold text-green-800 dark:text-green-400 wood:text-primary-900 text-lg">
                                    Notas Pessoais
                                </h4>
                            </div>
                            <p className="text-black text-sm dark:text-blue-200 wood:text-primary-800 leading-relaxed">
                                {book.notes}
                            </p>
                        </div>

                        {/* Informações Técnicas */}
                        <div
                            className="bg-fuchsia-100 dark:bg-fuchsia-100/20 wood:bg-secondary-200 rounded-lg"
                            style={{ padding: "1rem" }}
                        >
                            <div
                                className="flex items-center gap-2"
                                style={{ marginBottom: "0.7rem" }}
                            >
                                <svg
                                    className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400 wood:text-primary-900"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <h4 className="font-semibold text-fuchsia-800 dark:text-fuchsia-400 wood:text-primary-900 text-lg">
                                    Informações Técnicas
                                </h4>
                            </div>
                            <div className="text-black dark:text-blue-200 wood:text-primary-800 text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Editora:</span> Companhia das
                                    Letras
                                </p>
                                <p>
                                    <span className="font-medium">ISBN:</span> {book.isbn}
                                </p>
                                <p>
                                    <span className="font-medium">Idioma:</span> Português
                                </p>
                                <p>
                                    <span className="font-medium">Data de leitura:</span>{" "}
                                    {new Date(book.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botão Fechar */}
                    <div className="flex justify-center" style={{ marginBottom: "1rem" }}>
                        <button
                            onClick={onClose}
                            className="bg-white cursor-pointer text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors
                            wood:bg-secondary-200 wood:text-primary-900 wood:hover:bg-secondary-300"
                            style={{ padding: "0.5rem 1.5rem" }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
