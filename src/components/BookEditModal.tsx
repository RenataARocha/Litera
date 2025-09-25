'use client';
import { useState } from "react";
import Image from "next/image";
import { Book } from '@/types/types';
import PersonalNotes from './PersonalNotes';

type BookEditModalProps = {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (book: Book) => void;
};

export default function BookEditModal({ book, isOpen, onClose, onSave }: BookEditModalProps) {
    const [rating, setRating] = useState(book.rating);
    const [coverUrl, setCoverUrl] = useState(book.cover || "");

    if (!isOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Salvando alterações...");
        if (onSave) onSave(book);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
            style={{ padding: "1rem" }}
        >
            <div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                style={{ margin: "2rem" }}
            >
                <div style={{ padding: "1.5rem" }}>
                    {/* Header */}
                    <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900">Editar Livro</h2>
                            <p className="text-sm text-gray-900">Preencha as informações para catalogar seu livro</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
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

                    <form
                        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                        onSubmit={handleSave}
                    >
                        {/* Informações Obrigatórias */}
                        <div className="bg-red-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-red-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                <span className="text-red-500">*</span> Informações Obrigatórias
                            </h3>
                            <div
                                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                            >
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Título do Livro <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={book.title}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                        placeholder="Digite o título do livro"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Autor <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={book.author}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                        placeholder="Digite o nome do autor"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-blue-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-blue-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                Informações Adicionais
                            </h3>
                            <div
                                className="grid grid-cols-2 gap-4"
                                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                            >
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Ano de Publicação
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={book.year}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                        placeholder="Ex: 2023"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Total de Páginas
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="250"
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                        placeholder="Ex: 300"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Gênero
                                    </label>
                                    <select
                                        defaultValue={book.genre}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                    >
                                        <option value="Literatura Brasileira">📚 Literatura Brasileira</option>
                                        <option value="Ficção Científica">🚀 Ficção Científica</option>
                                        <option value="Realismo Mágico">✨ Realismo Mágico</option>
                                        <option value="Ficção">📖 Ficção</option>
                                        <option value="Fantasia">🐉 Fantasia</option>
                                        <option value="Romance">💕 Romance</option>
                                        <option value="Biografia">👤 Biografia</option>
                                        <option value="História">🏛️ História</option>
                                        <option value="Autoajuda">💪 Autoajuda</option>
                                        <option value="Tecnologia">💻 Tecnologia</option>
                                        <option value="Programação">⌨️ Programação</option>
                                        <option value="Negócios">💼 Negócios</option>
                                        <option value="Psicologia">🧠 Psicologia</option>
                                        <option value="Filosofia">🤔 Filosofia</option>
                                        <option value="Poesia">🎭 Poesia</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: '0.25rem' }}
                                    >
                                        Status de Leitura
                                    </label>
                                    <select
                                        defaultValue={book.status}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: '0.5rem 0.7rem' }}
                                    >
                                        <option value="não lido">📚 Não Lido</option>
                                        <option value="quero ler">🎯 Quero Ler</option>
                                        <option value="lendo">📖 Lendo</option>
                                        <option value="lido">✅ Lido</option>
                                        <option value="pausado">⏸️ Pausado</option>
                                        <option value="abandonado">❌ Abandonado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Avaliação com Estrelas */}
                            <div style={{ marginTop: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    Avaliação
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="text-2xl hover:scale-110 transition-transform"
                                            >
                                                {star <= rating ? (
                                                    <span className="text-yellow-400">★</span>
                                                ) : (
                                                    <span className="text-gray-300">★</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <span
                                        className="text-sm text-gray-600"
                                        style={{ marginLeft: "0.5rem" }}
                                    >
                                        {rating === 5 && "⭐⭐⭐⭐⭐ Excelente"}
                                        {rating === 4 && "⭐⭐⭐⭐ Muito Bom"}
                                        {rating === 3 && "⭐⭐⭐ Bom"}
                                        {rating === 2 && "⭐⭐ Regular"}
                                        {rating === 1 && "⭐ Ruim"}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: '0.25rem' }}
                                >
                                    ISBN
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{ padding: '0.5rem 0.7rem' }}
                                    placeholder="Ex: 978-85-359-0277-5"
                                />
                            </div>
                        </div>

                        {/* Capa do Livro */}
                        <div className="bg-purple-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-purple-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                Capa do Livro
                            </h3>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: '0.25rem' }}
                                >
                                    URL da Capa
                                </label>
                                <input
                                    type="url"
                                    value={coverUrl}
                                    onChange={(e) => setCoverUrl(e.target.value)}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{ padding: '0.5rem 0.7rem' }}
                                    placeholder="https://exemplo.com/capa-do-livro.jpg"
                                />
                                <p
                                    className="text-xs text-gray-500"
                                    style={{ marginTop: "0.25rem" }}
                                >
                                    Cole aqui o link da imagem da capa do livro
                                </p>

                                {/* Preview da capa */}
                                {coverUrl && (
                                    <div
                                        className="flex justify-center"
                                        style={{ marginTop: '1.5rem' }}
                                    >
                                        <Image
                                            src={coverUrl}
                                            alt="Capa do livro"
                                            width={128}
                                            height={192}
                                            className="object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conteúdo e Notas */}
                        <div className="bg-green-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-green-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                Conteúdo e Notas
                            </h3>

                            {/* Campo Sinopse */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: '0.25rem' }}
                                >
                                    Sinopse
                                </label>
                                <textarea
                                    rows={4}
                                    defaultValue={book.description}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    style={{ padding: '0.7rem' }}
                                    placeholder="Descreva brevemente o enredo do livro..."
                                />
                            </div>

                            {/* Campo Notas Pessoais */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: '0.25rem' }}
                                >
                                    Notas Pessoais
                                </label>
                                <PersonalNotes bookId={book.id} />
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div
                            className="flex gap-3 border-t border-gray-200"
                            style={{ paddingTop: "1rem" }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                style={{ padding: '0.75rem 1rem' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white rounded-lg bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 transition-colors font-medium cursor-pointer"
                                style={{ padding: '0.75rem 1rem' }}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}