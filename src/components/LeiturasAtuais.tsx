'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, TrendingUp, Edit, StickyNote, Pause, X, Play } from 'lucide-react';

type Book = {
    id: number;
    title: string;
    author: string;
    pages: number;
    finishedPages: number;
    startedAt: string;
    predictedEnd?: string;
    status: string;
};

const PageTransition = ({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) => {
    return (
        <div
            className={`transition-all duration-700 ease-in-out ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
        >
            {children}
        </div>
    );
};

const LeiturasAtuais = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [readingData, setReadingData] = useState({
        paginasHoje: 0,
        diasConsecutivos: 0,
        ritmoSemanal: 0,
        tempoMedio: 0
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
    const [pagesRead, setPagesRead] = useState('');
    const [readingTime, setReadingTime] = useState('');
    const [noteText, setNoteText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [noteMode, setNoteMode] = useState<'write' | 'view'>('write');
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving] = useState(false);

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000); // some após 3s
    };

    // Animação de entrada da página
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchReadingBooks = async () => {
            try {
                setLoading(true);

                const res = await fetch('/api/books?status=READING');
                if (!res.ok) throw new Error('Erro ao buscar livros');
                const data: Book[] = await res.json();

                // Filtra apenas os livros com status 'Lendo'
                const readingBooks = data.filter(book => book.status === 'Lendo');

                // Aguarda um pouco antes de mostrar
                await new Promise(resolve => setTimeout(resolve, 400));

                setBooks(readingBooks);

                // Atualiza estatísticas gerais
                setReadingData(prev => ({ ...prev, paginasHoje: 0 }));

                // Remove loading com delay menor
                setTimeout(() => setLoading(false), 300);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchReadingBooks();
    }, []);


    const openUpdateModal = (bookId: number) => {
        setSelectedBook(bookId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPagesRead('');
        setReadingTime('');
    };

    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
        setNoteText('');
    };

    const saveNote = () => {
        if (noteText.trim()) {
            showFeedback('Anotação salva com sucesso!');
            closeNoteModal();
        }
    };

    const handleSubmit = async () => {
        const pages = parseInt(pagesRead);

        // Validação completa
        if (!selectedBook) {
            showFeedback('Nenhum livro selecionado.');
            return;
        }

        if (isNaN(pages) || pages < 0) {
            showFeedback('Por favor, insira um número válido de páginas.');
            return;
        }

        // Encontra o livro para validar limites
        const book = books.find(b => b.id === selectedBook);
        if (!book) {
            showFeedback('Livro não encontrado.');
            return;
        }

        // Valida se não excede o total
        if (pages > book.pages) {
            showFeedback(`O livro tem apenas ${book.pages} páginas.`);
            return;
        }

        try {
            const res = await fetch(`/api/books/${selectedBook}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finishedPages: pages })
            });

            if (!res.ok) {
                let errorMessage = 'Erro ao atualizar livro';
                try {
                    const errorData = await res.json();
                    if (errorData && typeof errorData.message === 'string') {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Se não conseguir fazer parse do JSON, usa mensagem padrão
                }
                throw new Error(errorMessage);
            }

            // Calcula quantas páginas foram lidas hoje
            const paginasLidasHoje = pages - book.finishedPages;

            // Atualiza localmente - SUBSTITUI o valor, não soma
            setBooks(prev =>
                prev.map(b =>
                    b.id === selectedBook
                        ? { ...b, finishedPages: pages }  // ✅ SUBSTITUI
                        : b
                )
            );

            // Atualiza apenas as páginas lidas HOJE
            if (paginasLidasHoje > 0) {
                setReadingData(prev => ({
                    ...prev,
                    paginasHoje: prev.paginasHoje + paginasLidasHoje
                }));
            }

            showFeedback(`Progresso atualizado! ${pages} páginas lidas`);
            closeModal();
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar livro.';
            showFeedback(errorMessage);
        }
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
        showFeedback(!isPaused ? 'Leitura pausada.' : 'Leitura retomada!');
    };

    if (loading) return <p className="text-center mt-20 text-blue-600 dark:text-blue-400 font-medium text-2xl wood:text-accent-400" style={{ marginTop: '1rem' }}>Carregando livros...</p>;

    return (
        <div className={`min-h-screen transition-all duration-500 ${isLeaving ? 'opacity-0' : 'opacity-100'} dark:bg-slate-900 wood:bg-[var(--color-background)]`}>

            <div className="flex items-center justify-center min-h-screen" style={{ margin: '0.5rem' }}>
                <div className="w-full max-w-4xl mx-auto" style={{ padding: '20px 10px' }}>

                    {/* Título da Página com animação */}
                    <PageTransition isVisible={isVisible}>
                        <div className="text-center" style={{ marginBottom: '32px' }}>
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 transform transition-all duration-700 dark:text-blue-200 wood:text-[var(--color-foreground)]" style={{ marginBottom: '8px' }}>
                                Leituras Atuais
                            </h1>
                            <p className="text-sm md:text-lg text-gray-600 transition-all duration-700 delay-200 dark:text-blue-300 wood:text-primary-200" style={{ padding: '0 16px' }}>
                                Acompanhe seu progresso e mantenha o foco nos livros que está lendo
                            </p>
                        </div>
                    </PageTransition>

                    {/* Estatísticas com animação escalonada - Grid responsivo */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" style={{ marginBottom: '32px' }}>
                        {[
                            {
                                icon: BookOpen,
                                value: readingData.paginasHoje,
                                label: 'Páginas Hoje',
                                color: 'from-blue-500 to-cyan-500',
                                animationClass: 'hover:animate-bounce'
                            },
                            {
                                icon: Calendar,
                                value: readingData.diasConsecutivos,
                                label: 'Dias Consecutivos',
                                color: 'from-emerald-500 to-teal-500',
                                animationClass: 'hover:animate-pulse'
                            },
                            {
                                icon: TrendingUp,
                                value: readingData.ritmoSemanal,
                                label: 'Páginas/Semana',
                                color: 'from-purple-500 to-pink-500',
                                animationClass: 'hover:animate-ping'
                            },
                            {
                                icon: Clock,
                                value: readingData.tempoMedio,
                                label: 'Min/Dia',
                                color: 'from-orange-500 to-red-500',
                                animationClass: 'hover:animate-spin'
                            }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 text-center border border-gray-100 transform dark:bg-slate-800/50 dark:border-slate-700 dark:shadow-blue-500/10 wood:bg-primary-800/30 wood:border-primary-700 wood:shadow-accent-900/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{
                                    padding: '16px 12px',
                                    transitionDelay: `${index * 150}ms`
                                }}
                            >
                                <div
                                    className={`w-8 h-8 md:w-12 md:h-12 mx-auto bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center transition-all duration-300`}
                                    style={{ marginBottom: '12px' }}
                                >
                                    <stat.icon className={`w-4 h-4 md:w-6 md:h-6 text-white transition-all duration-200 ${stat.animationClass}`} />
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-gray-800 transition-all duration-300 dark:text-blue-100 wood:text-accent-300" style={{ marginBottom: '4px' }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 font-medium dark:text-blue-300 wood:text-primary-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Card do Livro com animação */}
                    <PageTransition isVisible={isVisible}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-lg dark:bg-slate-800/50 dark:border-slate-700 wood:bg-primary-800/20 wood:border-primary-700" style={{ marginBottom: '1rem', padding: '20px md:40px' }}>
                            <div className="text-center" style={{ padding: '1rem' }}>
                                <h2 className="text-xl md:text-2xl font-semibold flex items-center justify-center gap-3 text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">
                                    <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-600 transition-all duration-300 dark:text-blue-400 wood:text-accent-400" />
                                    Livros em Andamento
                                </h2>
                            </div>
                        </div>
                    </PageTransition>

                    <div className="max-w-7xl mx-auto max-h-[70vh] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-slate-700 wood:scrollbar-thumb-primary-600 wood:scrollbar-track-primary-900/30">
                        {books.length > 0 ? (
                            books.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 transition-all duration-500 hover:shadow-lg w-full mb-4 p-8 dark:from-slate-800/50 dark:to-slate-800/30 dark:border-slate-700 wood:from-primary-800/30 wood:to-primary-900/20 wood:border-primary-700"
                                    style={{ marginBottom: '1rem', padding: '2rem' }}
                                >
                                    {/* Informações do Livro */}
                                    <div className="text-center" style={{ marginBottom: '24px' }}>
                                        <div
                                            className="w-16 h-20 md:w-20 md:h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-blue-500 dark:to-indigo-500 wood:from-primary-600 wood:to-primary-800"
                                            style={{ marginBottom: '16px', padding: '6px md:8px' }}
                                        >
                                            {book.title.toUpperCase()}
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 transition-all duration-300 dark:text-blue-100 wood:text-[var(--color-foreground)]" style={{ marginBottom: '4px' }}>
                                            {book.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-gray-600 transition-all duration-300 dark:text-blue-300 wood:text-primary-200" style={{ marginBottom: '12px' }}>
                                            {book.author}
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm text-gray-600 dark:text-blue-300 wood:text-primary-300">
                                            <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 wood:hover:text-accent-400">
                                                📅 <strong>Iniciado:</strong> {book.startedAt ? new Date(book.startedAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não definido'}                                            </span>
                                            <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 wood:hover:text-accent-400">
                                                ⏱️ <strong>Previsão:</strong> {book.predictedEnd}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status de Pausa */}
                                    {isPaused && (
                                        <div className="bg-orange-100 border-l-4 border-orange-400 text-orange-700 text-center font-medium rounded-r-lg transition-all duration-500 transform hover:scale-105 text-sm md:text-base dark:bg-orange-900/30 dark:border-orange-500 dark:text-orange-300 wood:bg-accent-800/30 wood:border-accent-600 wood:text-accent-200" style={{ padding: '12px md:16px', marginBottom: '20px' }}>
                                            📚 Leitura pausada - Clique em &quot;Retomar&quot; para continuar
                                        </div>
                                    )}

                                    {/* Progresso */}
                                    <div style={{ marginBottom: '28px' }}>
                                        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                            <span className="text-gray-700 font-medium transition-all duration-300 text-sm md:text-base dark:text-blue-200 wood:text-primary-200">
                                                {book.finishedPages || 0} de {book.pages || 0} páginas
                                            </span>
                                            <span className="font-bold text-blue-600 text-lg md:text-xl transition-all duration-500 dark:text-blue-400 wood:text-accent-400">
                                                {book.pages && book.pages > 0
                                                    ? Math.round(((book.finishedPages || 0) / book.pages) * 100)
                                                    : 0
                                                }%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner dark:bg-slate-700 wood:bg-primary-900/50" style={{ marginBottom: '1rem' }}>
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out dark:from-blue-400 dark:to-indigo-400 wood:from-accent-500 wood:to-accent-600"
                                                style={{
                                                    width: book.pages && book.pages > 0
                                                        ? `${((book.finishedPages || 0) / book.pages) * 100}%`
                                                        : '0%'
                                                }}
                                            />
                                        </div>

                                        {/* **AJUSTE 2: REVISÃO DO GRID E DO TEXTO DOS BOTÕES PARA RESPONSIVIDADE** */}
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                onClick={() => openUpdateModal(book.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600 wood:bg-primary-600 wood:hover:bg-primary-700"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                                disabled={isPaused}
                                            >
                                                <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Atualizar Progresso</span>
                                                <span className="md:hidden">Atualizar</span>
                                            </button>

                                            <button
                                                onClick={() => { setNoteMode('write'); setIsNoteModalOpen(true); }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600 wood:bg-secondary-600 wood:hover:bg-secondary-700"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Fazer Anotação</span>
                                                <span className="md:hidden">Anotar</span>
                                            </button>

                                            <button
                                                onClick={() => { setNoteMode('view'); setIsNoteModalOpen(true); }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600 wood:bg-primary-700 wood:hover:bg-primary-800"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Ver Anotações</span>
                                                <span className="md:hidden">Anotações</span>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={togglePause}
                                        className={`${isPaused ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 wood:bg-secondary-500 wood:hover:bg-secondary-600' : 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 wood:bg-accent-600 wood:hover:bg-accent-700'} text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95`}
                                        style={{ padding: '10px 14px' }}
                                    >
                                        {isPaused ? <Play className="w-4 h-4 transition-transform duration-300" /> : <Pause className="w-4 h-4 transition-transform duration-300" />}
                                        {isPaused ? 'Retomar' : 'Pausar'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-blue-300 wood:text-primary-300">Nenhum livro em andamento</p>
                        )}
                    </div>
                </div>

                {/* Modal de Progresso com animação - Responsivo */}
                {isModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-slideInUp dark:bg-slate-800 wood:bg-primary-900" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">Atualizar Progresso</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 dark:hover:bg-slate-700 wood:hover:bg-primary-800">
                                    <X className="w-5 h-5 text-gray-500 dark:text-blue-300 wood:text-primary-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200" style={{ marginBottom: '6px' }}>
                                        Total de páginas lidas até agora:
                                    </label>
                                    <input
                                        type="number"
                                        value={pagesRead}
                                        onChange={(e) => setPagesRead(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-100 wood:border-primary-100 wood:focus:ring-accent-600"
                                        style={{ padding: '10px 14px' }}
                                        placeholder={`Ex: ${books.find(b => b.id === selectedBook)?.finishedPages || 0}`}
                                        min={0}
                                        max={books.find(b => b.id === selectedBook)?.pages || 999}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200" style={{ marginBottom: '6px' }}>
                                        Tempo de leitura (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={readingTime}
                                        onChange={(e) => setReadingTime(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-100 wood:border-primary-100 wood:focus:ring-accent-600"
                                        style={{ padding: '10px 14px' }}
                                        placeholder="Ex: 30"
                                        min={1}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3" style={{ paddingTop: '12px' }}>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105 dark:border-slate-600 dark:text-blue-200 dark:hover:bg-slate-700 wood:border-primary-700 wood:text-primary-200 wood:hover:bg-primary-800/50"
                                        style={{ padding: '10px 14px' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600 wood:bg-primary-600 wood:hover:bg-primary-700"
                                        style={{ padding: '10px 14px' }}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Anotação com animação - Responsivo  */}
                {isNoteModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform animate-slideInUp dark:bg-slate-800 wood:bg-primary-900" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">
                                    {noteMode === 'write' ? 'Fazer Anotação' : 'Minhas Anotações'}
                                </h3>
                                <button onClick={closeNoteModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 dark:hover:bg-slate-700 wood:hover:bg-primary-800">
                                    <X className="w-5 h-5 text-gray-500 dark:text-blue-300 wood:text-primary-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {noteMode === 'write' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200" style={{ marginBottom: '6px' }}>
                                            Suas reflexões sobre &quot;Dom Casmurro&quot;:
                                        </label>
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-200 wood:border-none wood:focus:ring-primary-300"
                                            style={{ padding: '12px', minHeight: '120px' }}
                                            placeholder="Escreva suas impressões, citações favoritas, análises do capítulo..."
                                            rows={6}
                                        />
                                        <div className="flex gap-3" style={{ marginTop: '12px' }}>
                                            <button
                                                onClick={closeNoteModal}
                                                className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105 dark:border-slate-600 dark:text-blue-200 dark:hover:bg-slate-700 wood:border-primary-700 wood:text-primary-200 wood:hover:bg-primary-800/50"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={saveNote}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105 dark:bg-emerald-500 dark:hover:bg-emerald-600 wood:bg-secondary-600 wood:hover:bg-secondary-700"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 min-h-[120px] transition-all duration-300 hover:border-gray-400 dark:border-slate-600 dark:from-slate-800/50 dark:to-slate-800/30 dark:text-blue-100 wood:border-primary-700 wood:from-primary-800/30 wood:to-primary-900/20 wood:text-[var(--color-foreground)]" style={{ padding: '16px' }}>
                                        {noteText ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-blue-300 wood:text-primary-300" style={{ marginBottom: '12px' }}>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse dark:bg-green-400 wood:bg-accent-500"></div>
                                                    <span>Suas anotações salvas</span>
                                                </div>
                                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium text-sm dark:text-blue-100 wood:text-[var(--color-foreground)]">
                                                    {noteText}
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse dark:bg-indigo-900/50 wood:bg-accent-900/50">
                                                        <div className="w-3 h-3 bg-indigo-500 rounded-full dark:bg-indigo-400 wood:bg-accent-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 wood:bg-primary-800 wood:hover:bg-primary-700">
                                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-blue-300 wood:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium mb-1 text-sm dark:text-blue-300 wood:text-primary-300">Nenhuma anotação ainda</p>
                                                <p className="text-gray-400 text-xs dark:text-blue-400 wood:text-primary-400">Suas anotações aparecerão aqui quando salvas</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback com animação melhorada - Responsivo */}
                {feedback && (
                    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 bg-green-500 text-white rounded-lg shadow-lg z-50 font-medium transform animate-slideInRight text-center sm:text-left max-w-sm mx-auto sm:mx-0 dark:bg-green-600 wood:bg-secondary-600" style={{ padding: '14px 18px' }}>
                        {feedback}
                    </div>
                )}
            </div>

            {/* CSS personalizado para animações */}
            <style jsx>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px) scale(0.95); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            
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
            
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out;
            }
            
            .animate-slideInUp {
    animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-slideInRight {
    animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

        @media (max-width: 640px) {
            .grid-cols-2 > div {
                min-height: 100px;
            }
        }
    `}</style>
        </div>
    );
};

export default LeiturasAtuais;