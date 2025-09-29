'use client';
import { useState, useEffect, } from "react";
import Image from "next/image";
import { Book } from '@/types/types';
import PersonalNotes from './PersonalNotes';

type BookEditModalProps = {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (book: Book) => void;
    onBack?: () => void;
};

export default function BookEditModal({ book, isOpen, onClose, onSave, onBack }: BookEditModalProps) {
    // Estados controlados
    const [title, setTitle] = useState(book.title || "");
    const [author, setAuthor] = useState(book.author || "");
    const [year, setYear] = useState<string | number>(book.year || "");
    const [genre, setGenre] = useState(book.genre || "");
    const [status] = useState(book.status || "não lido");
    const [description, setDescription] = useState(book.description || "");
    const [notes, setNotes] = useState(book.notes || "");
    const [isbn, setIsbn] = useState(book.isbn || "");
    const [rating, setRating] = useState(book.rating || 0);
    const [coverUrl, setCoverUrl] = useState(book.cover || "");
    const [coverFile, setCoverFile] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");


    // Salvar alterações
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedBook: Book = {
            ...book,
            title,
            author,
            year: year ? Number(year) : undefined,
            genre,
            status,
            description,
            notes,
            isbn,
            rating,
            cover: coverFile || coverUrl
        };
        if (onSave) onSave(updatedBook);
        onClose();
    };
    // Atualiza progresso dinamicamente
    useEffect(() => {
        let filled = 0;

        if (title.trim() !== "") filled++;
        if (author.trim() !== "") filled++;
        if (year.toString().trim() !== "" && Number(year) > 0) filled++;
        if (genre.trim() !== "") filled++;
        if (description.trim() !== "") filled++;
        if (notes.trim() !== "") filled++;
        if (isbn.trim() !== "") filled++;
        if (rating && rating > 0) filled++;
        if ((coverUrl && coverUrl.trim() !== "") || coverFile) filled++;

        const total = 8;
        const percent = Math.min(Math.round((filled / total) * 100), 100); // nunca passa de 100
        setProgress(percent);

        if (percent === 0) setMessage("Comece preenchendo o formulário! 📖");
        else if (percent < 50) setMessage("Ótimo começo! Continue ✨");
        else if (percent < 100) setMessage("Quase lá, não desista 💪");
        else setMessage("Parabéns, tudo pronto! 🎉");
    }, [title, author, year, genre, description, notes, rating, coverUrl, coverFile, isbn]);


    // Upload de capa
    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoverFile(url);
        }
    };

    const progressColor =
        progress < 50 ? "bg-red-400" : progress < 100 ? "bg-yellow-400" : "bg-green-500";

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 overflow-auto"
            style={{ padding: "1rem" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-book-title"
        >

            <div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl sm:mx-2"
                style={{ margin: "1rem" }}
            >
                {/* Botão Voltar */}
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-blue-600 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        style={{ padding: "1rem" }}
                        aria-label="Voltar para detalhes do livro"
                    >
                        ← Voltar para detalhes
                    </button>
                </div>

                <div style={{ padding: "1.5rem" }}>
                    {/* Header */}
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <div className="flex flex-col">
                            <h2
                                id="edit-book-title"
                                className="text-2xl font-bold text-gray-900"
                            >
                                Editar Livro
                            </h2>
                            <p className="text-sm text-gray-900">
                                Preencha as informações para catalogar seu livro
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded mt-3 sm:mt-0"
                            aria-label="Fechar modal"
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

                    {/* Barra de progresso */}
                    <div style={{ marginBottom: "1.1rem" }}>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-4 ${progressColor} transition-all duration-500`}
                                style={{ width: `${progress}%` }}
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                role="progressbar"
                            />
                        </div>
                        <p
                            className="text-sm text-gray-600 mt-2"
                            style={{ padding: "0.5rem" }}
                        >
                            {progress}% concluído — {message}
                        </p>
                    </div>

                    <form
                        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                        onSubmit={handleSave}
                    >
                        {/* === Informações Obrigatórias === */}
                        <div className="bg-red-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-red-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                <span className="text-red-500">*</span> Informações Obrigatórias
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label
                                        htmlFor="book-title"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Título do Livro <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="book-title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                        required
                                        aria-required="true"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="book-author"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Autor <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="book-author"
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                        required
                                        aria-required="true"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* === Informações Adicionais === */}
                        <div className="bg-blue-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3
                                className="text-lg font-semibold text-blue-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                Informações Adicionais
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="book-year"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Ano de Publicação
                                    </label>
                                    <input
                                        id="book-year"
                                        type="number"
                                        value={year.toString()}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: 2023"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="book-pages"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Total de Páginas
                                    </label>
                                    <input
                                        id="book-pages"
                                        type="number"
                                        defaultValue="250"
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: 300"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="book-genre"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Gênero
                                    </label>
                                    <select
                                        id="book-genre"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                        aria-label="Selecionar gênero do livro"
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
                                        htmlFor="book-status"
                                        className="block text-sm font-medium text-gray-700"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Status de Leitura
                                    </label>
                                    <select
                                        id="book-status"
                                        value={status}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                        aria-label="Selecionar status de leitura"
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
                        </div>

                        {/* Avaliação com Estrelas */}
                        <div style={{ marginTop: "1rem" }}>
                            <label
                                className="block text-sm font-medium text-gray-700"
                                style={{ marginBottom: "0.5rem" }}
                            >
                                Avaliação
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1" role="radiogroup" aria-label="Avaliação do livro">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                                            aria-checked={rating === star}
                                            role="radio"
                                        >
                                            {star <= rating ? (
                                                <span className="text-yellow-400">★</span>
                                            ) : (
                                                <span className="text-gray-300">★</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600" style={{ marginLeft: "0.5rem" }}>
                                    {rating === 5 && "⭐⭐⭐⭐⭐ Excelente"}
                                    {rating === 4 && "⭐⭐⭐⭐ Muito Bom"}
                                    {rating === 3 && "⭐⭐⭐ Bom"}
                                    {rating === 2 && "⭐⭐ Regular"}
                                    {rating === 1 && "⭐ Ruim"}
                                </span>
                            </div>
                        </div>

                        {/* ISBN */}
                        <div style={{ marginTop: "1rem" }}>
                            <label
                                htmlFor="book-isbn"
                                className="block text-sm font-medium text-gray-700"
                                style={{ marginBottom: "0.25rem" }}
                            >
                                ISBN
                            </label>
                            <input
                                id="book-isbn"
                                type="text"
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                style={{ padding: "0.5rem 0.7rem" }}
                                placeholder="Ex: 978-85-359-0277-5"
                            />
                        </div>

                        {/* Capa do Livro */}
                        <div className="bg-purple-50 rounded-lg" style={{ padding: "1rem", marginTop: "1rem" }}>
                            <h3 className="text-lg font-semibold text-purple-800" style={{ marginBottom: "1rem" }}>
                                Capa do Livro
                            </h3>

                            {/* URL da capa */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    htmlFor="cover-url"
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    URL da Capa
                                </label>
                                <input
                                    id="cover-url"
                                    type="text"
                                    value={coverUrl}
                                    onChange={(e) => setCoverUrl(e.target.value)}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{ padding: "0.5rem 0.7rem" }}
                                    placeholder="https://exemplo.com/capa-do-livro.jpg"
                                    aria-label="URL da capa do livro"
                                />
                                <p className="text-xs text-gray-500" style={{ marginTop: "0.25rem" }}>
                                    Cole aqui o link da imagem da capa do livro
                                </p>
                            </div>

                            {/* Upload de capa */}
                            <div>
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="cover-upload"
                                    className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{ padding: "0.5rem 0.7rem" }}
                                    aria-label="Escolher arquivo de capa"
                                >
                                    Escolher Arquivo
                                </label>
                            </div>

                            {/* Preview da capa */}
                            {(coverFile || coverUrl) && (
                                <div className="flex justify-center" style={{ marginTop: "1rem" }}>
                                    <Image
                                        src={coverFile || coverUrl}
                                        alt="Capa do livro"
                                        width={128}
                                        height={192}
                                        className="object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* === Conteúdo e Notas === */}
                        <div className="bg-green-50 rounded-lg" style={{ padding: "1rem" }}>
                            <h3 className="text-lg font-semibold text-green-800" style={{ marginBottom: "1rem" }}>
                                Conteúdo e Notas
                            </h3>

                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    htmlFor="book-description"
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    Sinopse
                                </label>
                                <textarea
                                    id="book-description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    style={{ padding: "0.7rem" }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="personal-notes"
                                    className="block text-sm font-medium text-gray-700"
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    Notas Pessoais
                                </label>
                                <PersonalNotes
                                    bookId={book.id}
                                    initialNotes={notes}
                                    placeholder="Escreva suas notas pessoais..."
                                    onChange={(value) => setNotes(value)}
                                />
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-200" style={{ paddingTop: "1rem" }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                                style={{ padding: "0.75rem 1rem" }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white rounded-lg bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ padding: "0.75rem 1rem" }}
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
