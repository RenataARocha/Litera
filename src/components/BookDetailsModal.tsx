'use client';
import Image from "next/image";
import { Book } from '@/types/types';
import StarRating from './StarRating';
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
    onDelete
}: BookDetailsModalProps) {
    if (!isOpen) return null;

    const getStatusConfig = (status: string) => {
        const configs = {
            'lido': { text: "Lido", bgColor: "bg-green-100", textColor: "text-green-700" },
            'lendo': { text: "Lendo", bgColor: "bg-blue-100", textColor: "text-blue-700" },
            'pausado': { text: "Pausado", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
            'quero ler': { text: "Quero Ler", bgColor: "bg-purple-100", textColor: "text-purple-700" },
            'abandonado': { text: "Abandonado", bgColor: "bg-red-100", textColor: "text-red-700" }
        };
        const normalizedStatus = status.toLowerCase();
        return configs[normalizedStatus as keyof typeof configs] || configs['abandonado'];
    };

    const statusConfig = getStatusConfig(book.status);

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-blue-50 rounded-xl w-full max-h-[95vh] overflow-y-auto shadow-2xl sm:max-w-2xl">
                <div>
                    {/* Header com botão fechar */}
                    <div style={{ margin: "1rem" }}>
                        <button
                            onClick={onClose}
                            aria-label="Fechar modal"
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                role="img"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Seção superior responsiva */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-blue-100 rounded-lg items-center sm:items-start"
                        style={{ padding: "1rem", margin: "1rem", marginBottom: "1.5rem" }}
                    >
                        {/* Capa */}
                        <div className="flex-shrink-0">
                            {book.cover ? (
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    width={150}
                                    height={200}
                                    className="rounded-lg shadow-lg w-full h-auto max-w-[150px] sm:max-w-[200px]"
                                />
                            ) : (
                                <div className="w-[150px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center sm:w-[200px] sm:h-[270px]">
                                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                                    </svg>
                                </div>
                            )}
                        </div>


                        {/* Informações */}
                        <div className="flex-1">
                            <h3 id="modal-title" className="font-bold text-lg sm:text-xl text-gray-900" style={{ marginBottom: "0.25rem" }}>
                                {book.title}
                            </h3>
                            <p className="text-gray-600 text-base sm:text-lg">{book.author}</p>

                            <div className="flex items-center gap-1 mt-2">
                                <StarRating rating={book.rating} showNumber />
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                <div>
                                    <span className="font-medium text-gray-700">Ano:</span>
                                    <p className="text-gray-600">{book.year}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Páginas:</span>
                                    <p className="text-gray-600">250p</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Gênero:</span>
                                    <p className="text-gray-600">{book.genre}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <span
                                        className={`inline-block rounded-full text-xs ${statusConfig.bgColor} ${statusConfig.textColor}`}
                                        style={{ padding: "0.25rem 0.5rem", marginLeft: "0.25rem" }}
                                    >
                                        {statusConfig.text}
                                    </span>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="rounded-lg" style={{ padding: "1rem", marginTop: "1rem" }}>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={onEdit}
                                        className="flex-1 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-gradient-to-r from-blue-500 to-blue-900 transition-colors flex items-center justify-center gap-2"
                                        style={{ padding: "0.5rem 1rem", height: "2.5rem" }}
                                    >
                                        Editar Livro
                                    </button>
                                    <button
                                        onClick={onDelete}
                                        className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-gradient-to-r from-red-500 to-red-700 transition-colors flex items-center justify-center gap-2"
                                        style={{ padding: "0.5rem 1rem", height: "2.5rem" }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                                <Timer bookId={book.id} />
                            </div>
                        </div>
                    </div>

                    {/* Seções de conteúdo */}
                    <div className="bg-white/50 rounded-lg" style={{ padding: "1rem", margin: "1rem" }}>
                        {/* Sinopse */}
                        <section className="bg-violet-100 rounded-lg" style={{ padding: "1rem", marginBottom: "1rem" }}>
                            <h4 className="flex items-center gap-2 font-semibold text-purple-800 text-lg" style={{ marginBottom: "0.7rem" }}>
                                Sinopse
                            </h4>
                            <p className="text-black text-sm leading-relaxed">{book.description}</p>
                        </section>

                        {/* Notas */}
                        <section className="bg-green-100 rounded-lg" style={{ padding: "1rem", marginBottom: "1rem" }}>
                            <h4 className="flex items-center gap-2 font-semibold text-green-800 text-lg" style={{ marginBottom: "0.7rem" }}>
                                Notas Pessoais
                            </h4>
                            <p className="text-black text-sm leading-relaxed">
                                Uma obra-prima da literatura brasileira que explora temas universais como amor, ciúme e memória.
                            </p>
                        </section>

                        {/* Técnicas */}
                        <section className="bg-fuchsia-100 rounded-lg" style={{ padding: "1rem" }}>
                            <h4 className="flex items-center gap-2 font-semibold text-fuchsia-800 text-lg" style={{ marginBottom: "0.7rem" }}>
                                Informações Técnicas
                            </h4>
                            <ul className="text-black text-sm space-y-1">
                                <li><span className="font-medium">Editora:</span> Companhia das Letras</li>
                                <li><span className="font-medium">ISBN:</span> 978-85-359-0277-5</li>
                                <li><span className="font-medium">Idioma:</span> Português</li>
                                <li><span className="font-medium">Data de leitura:</span> Março 2024</li>
                            </ul>
                        </section>
                    </div>

                    {/* Botão fechar */}
                    <div className="flex justify-center" style={{ marginBottom: "1rem" }}>
                        <button
                            onClick={onClose}
                            className="bg-white cursor-pointer text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
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