"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Book } from "@/components/types/types";
import PersonalNotes from "./PersonalNotes";

type BookEditModalProps = {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (book: Book) => void;
    onBack?: () => void;
    updateBookNotes?: (bookId: number, newNotes: string) => void;
};

export default function BookEditModal({
    book,
    isOpen,
    onClose,
    onSave,
    onBack,
}: BookEditModalProps) {
    // ✅ TODOS os hooks ANTES de qualquer return (na ordem correta)
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [year, setYear] = useState<string | number>("");
    const [genre, setGenre] = useState<string>("");
    const [status, setStatus] = useState<string>("Quero Ler");
    const [description, setDescription] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [isbn, setIsbn] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [coverUrl, setCoverUrl] = useState<string>("");
    const [coverFile, setCoverFile] = useState<string | null>(null);
    const [pages, setPages] = useState<number>(0);
    const [finishedPages, setFinishedPages] = useState<number>(0);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Sincroniza os estados quando a prop `book` mudar
    useEffect(() => {
        if (!book) return;

        setTitle(book.title ?? "");
        setAuthor(book.author ?? "");
        setYear(book.year ?? "");
        setGenre(book.genre ?? "");
        setStatus(book.status ?? "Quero Ler");
        setDescription(book.description ?? "");
        setNotes(book.notes ?? "");
        setIsbn(book.isbn ?? "");
        setRating(Number(book.rating ?? 0));
        setCoverUrl(book.cover ?? "");
        setCoverFile(null);

        const bookWithPages = book as Book & { pages?: number; finishedPages?: number };
        setPages(bookWithPages.pages ?? 0);
        setFinishedPages(bookWithPages.finishedPages ?? 0);
    }, [book]);

    // Atualiza progresso dinamicamente
    useEffect(() => {
        let filled = 0;
        if (title.trim() !== "") filled++;
        if (author.trim() !== "") filled++;
        if (String(year).trim() !== "" && Number(year) > 0) filled++;
        if (genre.trim() !== "") filled++;
        if (description.trim() !== "") filled++;
        if (notes.trim() !== "") filled++;
        if (isbn.trim() !== "") filled++;
        if (rating && rating > 0) filled++;
        if ((coverUrl && coverUrl.trim() !== "") || coverFile) filled++;

        const total = 8;
        const percent = Math.min(Math.round((filled / total) * 100), 100);
        setProgress(percent);

        if (percent === 0) setMessage("Comece preenchendo o formulário! 📖");
        else if (percent < 50) setMessage("Ótimo começo! Continue ✨");
        else if (percent < 100) setMessage("Quase lá, não desista 💪");
        else setMessage("Parabéns, tudo pronto! 🎉");
    }, [
        title,
        author,
        year,
        genre,
        description,
        notes,
        rating,
        coverUrl,
        coverFile,
        isbn,
        pages,
        finishedPages,
    ]);

    // ✅ Returns condicionais DEPOIS dos hooks
    if (!isOpen) return null;
    if (!book) return null;

    // Salvar alterações com debug melhorado
    const handleSave = async (e: React.FormEvent) => {
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
            cover: coverFile || coverUrl,
            pages,
            finishedPages,
        };

        try {
            console.log("📤 Enviando dados:", updatedBook);

            // 🔥 Pega o token do localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Você precisa estar autenticado para editar livros');
                return;
            }

            console.log("📍 URL:", `/api/books/${book.id}`);
            console.log("🔐 Token encontrado:", token ? 'Sim' : 'Não');

            const response = await fetch(`/api/books/${book.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // 🔥 ADICIONA O TOKEN
                },
                body: JSON.stringify(updatedBook),
            });

            console.log("📊 Status da resposta:", response.status);

            if (!response.ok) {
                let errorMessage = "Erro ao salvar alterações";
                let errorDetails = null;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    errorDetails = errorData.details || null;
                    console.error("❌ Erro da API:", errorData);
                    console.error("❌ Status:", response.status);
                    console.error("❌ Mensagem:", errorMessage);

                    // 🔥 Se for 401, provavelmente o token expirou
                    if (response.status === 401) {
                        alert('Sua sessão expirou. Por favor, faça login novamente.');
                        localStorage.removeItem('token');
                        return;
                    }
                } catch {
                    console.error("❌ Erro ao parsear resposta de erro");
                }

                throw new Error(errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage);
            }

            const savedBook = await response.json();
            console.log("✅ Livro atualizado:", savedBook);

            // 🆕 Mostra mensagem de sucesso
            setShowSuccessMessage(true);
            if (onSave) onSave(savedBook);

            // 🆕 Fecha após 2 segundos
            setTimeout(() => {
                setShowSuccessMessage(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error("💥 Erro completo:", error);
            alert(`Não foi possível salvar as alterações.\n${error instanceof Error ? error.message : ''}`);
        }
    };

    // Upload de capa
    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoverFile(url);
        }
    };

    const progressColor =
        progress < 50
            ? "bg-red-400"
            : progress < 100
                ? "bg-yellow-400"
                : "bg-green-500";

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 wood:bg-background/50 flex items-center justify-center z-50"
            style={{ padding: "1rem" }}
        >
            {showSuccessMessage && (
                <div
                    className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
                    style={{ marginTop: '20px', padding: '0 10px' }}
                >
                    <div className="bg-green-500 text-white rounded-xl shadow-2xl animate-bounce pointer-events-auto" style={{ padding: '20px' }}>
                        <div className="flex items-center gap-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="font-bold text-xl">Sucesso!</p>
                                <p className="text-sm">Livro editado com sucesso ✨</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl wood:bg-accent-700"
                style={{ margin: "1rem" }}
            >
                {/* Botão Voltar */}
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer wood:text-accent-300"
                        style={{ padding: "1rem" }}
                    >
                        ← Voltar para detalhes
                    </button>
                </div>

                <div style={{ padding: "1.5rem" }}>
                    {/* Header */}
                    <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-blue-600 wood:text-primary-100">
                                Editar Livro
                            </h2>
                            <p className="text-sm text-gray-900 dark:text-blue-400 wood:text-primary-50">
                                Preencha as informações para catalogar seu livro
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 dark:text-blue-200 cursor-pointer hover:text-gray-900 transition-colors wood:text-accent-500"
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
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden wood:bg-yellow-200">
                            <div
                                className={`h-4 ${progressColor} transition-all duration-500`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p
                            className="text-sm text-gray-600 dark:text-blue-200 mt-2 wood:text-primary-50"
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
                        <div
                            className="bg-red-50 dark:bg-blue-200/10 rounded-lg wood:bg-primary-100"
                            style={{ padding: "1rem" }}
                        >
                            <h3
                                className="text-lg font-semibold text-red-800 dark:text-rose-500 wood:text-red-800"
                                style={{ marginBottom: "1rem" }}
                            >
                                <span className="text-red-500">*</span> Informações Obrigatórias
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Título do Livro <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="
    w-full text-sm border rounded-lg 
    bg-white/90 border-gray-200
    focus:outline-none 
    focus:ring-2 focus:ring-blue-500
    wood:focus:border-primary-200 wood:focus:ring-2 wood:focus:ring-primary-200
    dark:bg-slate-800/80 dark:text-blue-100 dark:placeholder-blue-300/60 dark:border-blue-400
    wood:bg-white/60 wood:text-primary-900
  "
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Autor <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-slate-800/80 
                                dark:text-blue-100 
                                dark:placeholder-blue-300/60 
                                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* === Informações Adicionais === */}
                        <div
                            className="bg-blue-50 dark:bg-blue-200/10 rounded-lg wood:bg-primary-100"
                            style={{ padding: "1rem" }}
                        >
                            <h3
                                className="text-lg font-semibold text-blue-800 dark:text-blue-500 wood:text-primary-900"
                                style={{ marginBottom: "1rem" }}
                            >
                                Informações Adicionais
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Ano de Publicação
                                    </label>
                                    <input
                                        type="number"
                                        value={year.toString()}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-slate-800/80 
                dark:text-blue-100 
                dark:placeholder-blue-300/60 
                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        placeholder="Ex: 2023"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Total de Páginas
                                    </label>
                                    <input
                                        type="number"
                                        value={pages}
                                        onChange={(e) => setPages(Number(e.target.value))}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-slate-800/80 
                dark:text-blue-100 
                dark:placeholder-blue-300/60 
                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        placeholder="Ex: 300"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Páginas Lidas
                                    </label>
                                    <input
                                        type="number"
                                        value={finishedPages}
                                        onChange={(e) => setFinishedPages(Number(e.target.value))}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-slate-800/80 
                dark:text-blue-100 
                dark:placeholder-blue-300/60 
                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        placeholder="Ex: 120"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-500 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Gênero
                                    </label>
                                    <select
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-slate-800/80 
                dark:text-blue-100 
                dark:placeholder-blue-300/60 
                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    >
                                        <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="">Selecione uma categoria</option>

                                        {/* 📚 FICÇÃO */}
                                        <optgroup label="📚 FICÇÃO" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Literatura Brasileira">📚 Literatura Brasileira</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção">📖 Ficção</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção Científica">🚀 Ficção Científica</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fantasia">🐉 Fantasia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Realismo Mágico">✨ Realismo Mágico</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Distopia">🌆 Distopia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Steampunk/Cyberpunk">⚙️ Steampunk/Cyberpunk</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Romance">💕 Romance</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Romance Histórico">💕📜 Romance Histórico</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Terror">👻 Terror</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Suspense">🕵️‍♀️ Suspense</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Mistério">🧩 Mistério</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Thriller">🔪 Thriller</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Crime/Policial">🚔 Crime/Policial</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Paranormal">👁️ Paranormal</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Drama">🎬 Drama</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Aventura">🏔️ Aventura</option>
                                        </optgroup>

                                        {/* 📖 LITERATURA ESPECÍFICA */}
                                        <optgroup label="📖 LITERATURA" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Clássicos">🏺 Clássicos</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Poesia">🎭 Poesia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Contos">📜 Contos</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Crônicas">📝 Crônicas</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ensaios">📚 Ensaios</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Antologias">📖 Antologias</option>
                                        </optgroup>

                                        {/* 👥 NÃO-FICÇÃO */}
                                        <optgroup label="👥 NÃO-FICÇÃO" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Biografia">👤 Biografia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Memórias">🕰️ Memórias</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cartas e Diários">✉️ Cartas e Diários</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="História">🏛️ História</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="True Crime">🔍 True Crime</option>
                                        </optgroup>

                                        {/* 🧠 DESENVOLVIMENTO PESSOAL */}
                                        <optgroup label="🧠 DESENVOLVIMENTO PESSOAL" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Autoajuda">💪 Autoajuda</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Desenvolvimento Pessoal">🌟 Desenvolvimento Pessoal</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Psicologia">🧠 Psicologia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Filosofia">🤔 Filosofia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Espiritualidade">🌙 Espiritualidade</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Religião">🙏 Religião</option>
                                        </optgroup>

                                        {/* 💼 NEGÓCIOS E CARREIRA */}
                                        <optgroup label="💼 NEGÓCIOS E CARREIRA" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Negócios">💼 Negócios</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Empreendedorismo">🚀 Empreendedorismo</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Marketing/Vendas">📈 Marketing/Vendas</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Economia">💰 Economia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Finanças Pessoais">💸 Finanças Pessoais</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Direito">⚖️ Direito</option>
                                        </optgroup>

                                        {/* 💻 TECNOLOGIA */}
                                        <optgroup label="💻 TECNOLOGIA" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Tecnologia">💻 Tecnologia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Programação">⌨️ Programação</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Games">🎮 Games</option>
                                        </optgroup>

                                        {/* 🔬 CIÊNCIAS */}
                                        <optgroup label="🔬 CIÊNCIAS" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ciência">🔬 Ciência</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Matemática">📏 Matemática</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Astronomia">🌌 Astronomia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Saúde">🩺 Saúde</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Nutrição">🥗 Nutrição</option>
                                        </optgroup>

                                        {/* 🎨 ARTES E CULTURA */}
                                        <optgroup label="🎨 ARTES E CULTURA" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Artes">🎨 Artes</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Música">🎵 Música</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cinema e TV">📺 Cinema e TV</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fotografia">📸 Fotografia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Moda">👗 Moda</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Beleza">💅 Beleza</option>
                                        </optgroup>

                                        {/* 📚 QUADRINHOS E GRAPHIC NOVELS */}
                                        <optgroup label="📚 QUADRINHOS" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="HQs e Mangás">🦸 HQs e Mangás</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Quadrinhos Nacionais">🇧🇷 Quadrinhos Nacionais</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Graphic Novels">🎨📖 Graphic Novels</option>
                                        </optgroup>

                                        {/* 👶 PÚBLICO JOVEM */}
                                        <optgroup label="👶 PÚBLICO JOVEM" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Infantil">🧸 Infantil</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Juvenil">🎒 Juvenil</option>
                                        </optgroup>

                                        {/* 🌍 SOCIEDADE E MEIO AMBIENTE */}
                                        <optgroup label="🌍 SOCIEDADE" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Política">🏛️ Política</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Sociologia">🌍 Sociologia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ecologia">🌱 Ecologia</option>
                                        </optgroup>

                                        {/* 🏗️ ÁREAS TÉCNICAS */}
                                        <optgroup label="🏗️ ÁREAS TÉCNICAS" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Arquitetura">🏗️ Arquitetura</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Engenharia">🧱 Engenharia</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Educação">📘 Educação</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Didáticos">📗 Didáticos</option>
                                        </optgroup>

                                        {/* 🎭 LIFESTYLE */}
                                        <optgroup label="🎭 LIFESTYLE" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Culinária">🍳 Culinária</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Viagens">✈️ Viagens</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Esportes">⚽ Esportes</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Jardinagem">🌻 Jardinagem</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Pets/Animais">🐾 Pets/Animais</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Humor">😂 Humor</option>
                                        </optgroup>

                                        {/* 🎭 TEMAS ESPECIAIS */}
                                        <optgroup label="🎭 TEMAS ESPECIAIS" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Erótico">🔥 Erótico</option>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="LGBTQIA+">🏳️‍🌈 LGBTQIA+</option>
                                        </optgroup>

                                        {/* 📘 OUTROS */}
                                        <optgroup label="📘 OUTROS" className='dark:text-blue-900 dark:bg-white'>
                                            <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Outros">📘 Outros</option>
                                        </optgroup>

                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        Status de Leitura
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-slate-800/80 
                dark:text-blue-100 
                dark:placeholder-blue-300/60 
                dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
                wood:focus:ring-2 wood:focus:ring-primary-200"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    >
                                        <option value="Não Lido">📚 Não Lido</option>
                                        <option value="Quero Ler">🎯 Quero Ler</option>
                                        <option value="Lendo">📖 Lendo</option>
                                        <option value="Lido">✅ Lido</option>
                                        <option value="Pausado">⏸️ Pausado</option>
                                        <option value="Abandonado">❌ Abandonado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Avaliação com Estrelas */}
                            <div style={{ marginTop: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-blue-500 wood:text-primary-900"
                                    style={{ marginBottom: "0.5rem" }}
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
                                                className="text-2xl hover:scale-110 transition-transform wood:text-primary-900"
                                            >
                                                {star <= rating ? (
                                                    <span className="text-yellow-400">
                                                        ★
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 wood:text-primary-300">
                                                        ★
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <span
                                        className="text-sm text-gray-600 dark:text-blue-400 wood:text-primary-800"
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

                            {/* ISBN */}
                            <div style={{ marginTop: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-700 dark:text-blue-500 wood:text-primary-900"
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    ISBN
                                </label>
                                <input
                                    type="text"
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        dark:bg-slate-800/80 
        dark:text-blue-100 
        dark:placeholder-blue-300/60 
        dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
        wood:focus:ring-2 wood:focus:ring-primary-200"
                                    style={{ padding: "0.5rem 0.7rem" }}
                                    placeholder="Ex: 978-85-359-0277-5"
                                />
                            </div>

                            {/* Capa do Livro */}
                            <div
                                className="bg-purple-50 rounded-lg dark:bg-slate-800/80 wood:bg-primary-200"
                                style={{ padding: "1rem", marginTop: "1rem" }}
                            >
                                <h3
                                    className="text-lg font-semibold text-purple-800 dark:text-purple-500 wood:text-primary-900"
                                    style={{ marginBottom: "1rem" }}
                                >
                                    Capa do Livro
                                </h3>

                                {/* URL da capa */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <label
                                        className="block text-sm font-medium text-gray-700 dark:text-blue-400 wood:text-primary-900"
                                        style={{ marginBottom: "0.25rem" }}
                                    >
                                        URL da Capa
                                    </label>
                                    <input
                                        type="text"
                                        value={coverUrl}
                                        onChange={(e) => setCoverUrl(e.target.value)}
                                        className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            dark:bg-slate-800/80 
            dark:text-blue-100 
            dark:placeholder-blue-300/60 
            dark:border-blue-400 wood:bg-white/60 wood:text-primary-900
            wood:focus:ring-2 wood:focus:ring-primary-200"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                        placeholder="https://exemplo.com/capa-do-livro.jpg"
                                    />
                                    <p
                                        className="text-xs text-gray-500 dark:text-blue-300 wood:text-primary-800"
                                        style={{ marginTop: "0.25rem" }}
                                    >
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
                                        className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors wood:bg-secondary-700 wood:text-accent-100 wood:hover:bg-primary-800"
                                        style={{ padding: "0.5rem 0.7rem" }}
                                    >
                                        Escolher Arquivo
                                    </label>
                                </div>

                                {/* Preview da capa */}
                                {(coverFile || coverUrl) && (
                                    <div
                                        className="flex justify-center"
                                        style={{ marginTop: "1rem" }}
                                    >
                                        <Image
                                            src={coverFile || coverUrl}
                                            alt="Capa do livro"
                                            width={128}
                                            height={192}
                                            className="object-cover rounded-lg border wood:border-primary-700"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* === Conteúdo e Notas === */}
                        <div
                            className="bg-green-50 dark:bg-blue-200/10 rounded-lg wood:bg-secondary-400"
                            style={{ padding: "1rem" }}
                        >
                            <h3
                                className="text-lg font-semibold text-green-900 dark:text-green-500 wood:text-primary-900"
                                style={{ marginBottom: "1rem" }}
                            >
                                Conteúdo e Notas
                            </h3>
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    className="block text-sm font-medium text-gray-800 dark:text-blue-400 wood:text-primary-900"
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    Sinopse
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full text-sm border bg-white/90 border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                    dark:bg-slate-800/80 
                    dark:text-blue-100 
                    dark:placeholder-blue-300/60 
                    dark:border-blue-400 wood:bg-white/80 wood:text-primary-900
                    wood:focus:ring-2 wood:focus:ring-primary-200"
                                    style={{ padding: "0.7rem" }}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-800 dark:text-blue-400 wood:text-primary-900 "
                                    style={{ marginBottom: "0.25rem" }}
                                >
                                    Notas Pessoais
                                </label>
                                <PersonalNotes
                                    initialNotes={notes}
                                    placeholder="Escreva suas notas pessoais..."
                                    onChange={(value) => setNotes(value)}
                                />

                            </div>
                        </div>

                        {/* Botões */}
                        <div
                            className="flex gap-3 border-t border-gray-200 wood:border-primary-700"
                            style={{ paddingTop: "1rem" }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium wood:bg-primary-900 wood:text-primary-200 wood:hover:bg-primary-800"
                                style={{ padding: "0.75rem 1rem" }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 
  bg-blue-600 text-white rounded-lg 
  bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 
  transition-colors font-medium cursor-pointer
  wood:bg-gradient-to-r wood:from-primary-800 wood:to-secondary-900 wood:hover:from-primary-900 wood:hover:to-secondary-800
  wood:text-accent-100"
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