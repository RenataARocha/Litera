'use client';
import Image from "next/image";
import { Book } from '@/components/types/types';
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
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-blue-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

                <div>
                    {/* Header com botão fechar */}
                    <div style={{ margin: '1rem' }}>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Seção superior: Capa e Informações lado a lado */}
                    <div className="flex gap-6 bg-blue-100 rounded-lg" style={{ padding: '2rem', margin: '1rem', marginBottom: '1.5rem' }}>
                        {/* Capa do livro */}
                        <div className="flex-shrink-0">
                            {book.cover ? (
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    width={150}
                                    height={200}
                                    className="rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="w-[150px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Informações do livro */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900" style={{ marginBottom: '0.25rem' }}>{book.title}</h3>
                                    <p className="text-gray-600 text-lg">{book.author}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <StarRating rating={book.rating} showNumber />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
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
                                        <span className={`inline-block rounded-full text-xs ${statusConfig.bgColor} ${statusConfig.textColor}`} style={{ padding: '0.25rem 0.5rem', marginLeft: '0.25rem' }}>
                                            {statusConfig.text}
                                        </span>
                                    </div>
                                </div>

                                {/* Botões de ação com fundo azul */}
                                <div className="rounded-lg" style={{ padding: '1rem', marginTop: '1rem' }}>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onEdit}
                                            className="flex-1 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-gradient-to-r from-blue-500 to-blue-900 transition-colors flex items-center justify-center gap-2"
                                            style={{ padding: '0.5rem 1rem', height: '2rem', marginTop: '1rem' }}
                                        >
                                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3-6.5 6.5-.5 3 3-.5 6.5-6.5z" />
                                            </svg>
                                            Editar Livro
                                        </button>
                                        <button
                                            onClick={onDelete}
                                            className="flex-1 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-gradient-to-r from-red-500 to-red-700 transition-colors flex items-center justify-center gap-2"
                                            style={{ padding: '0.5rem 1rem', height: '2rem', marginTop: '1rem' }}
                                        >
                                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                            </svg>
                                            Excluir
                                        </button>
                                    </div>
                                    <Timer bookId={book.id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seções de conteúdo */}
                    <div className="bg-white/50 rounded-lg" style={{ padding: '1rem', margin: '1rem' }}>
                        {/* Sinopse */}
                        <div className="bg-violet-100 rounded-lg" style={{ padding: '1rem', marginBottom: '1rem' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.7rem' }}>
                                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                <h4 className="font-semibold text-purple-800 text-lg">Sinopse</h4>
                            </div>
                            <p className="text-black text-sm leading-relaxed">{book.description}</p>
                        </div>

                        {/* Notas Pessoais */}
                        <div className="bg-green-100 rounded-lg" style={{ padding: '1rem', marginBottom: '1rem' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.7rem' }}>
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                                <h4 className="font-semibold text-green-800 text-lg">Notas Pessoais</h4>
                            </div>
                            <p className="text-black text-sm leading-relaxed">
                                Uma obra-prima da literatura brasileira que explora temas universais como amor, ciúme e memória. A narrativa envolvente de Machado de Assis revela camadas profundas da natureza humana através dos olhos de Bentinho.
                            </p>
                        </div>

                        {/* Informações Técnicas */}
                        <div className="bg-fuchsia-100 rounded-lg" style={{ padding: '1rem' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.7rem' }}>
                                <svg className="w-5 h-5 text-fuchsia-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <h4 className="font-semibold text-fuchsia-800 text-lg">Informações Técnicas</h4>
                            </div>
                            <div className="text-black text-sm space-y-1">
                                <p><span className="font-medium">Editora:</span> Companhia das Letras</p>
                                <p><span className="font-medium">ISBN:</span> 978-85-359-0277-5</p>
                                <p><span className="font-medium">Idioma:</span> Português</p>
                                <p><span className="font-medium">Data de leitura:</span> Março 2024</p>
                            </div>
                        </div>
                    </div>

                    {/* Botão Fechar */}
                    <div className="flex justify-center" style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={onClose}
                            className="bg-white cursor-pointer text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                            style={{ padding: '0.5rem 1.5rem' }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}