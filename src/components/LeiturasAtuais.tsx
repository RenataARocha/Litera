'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
            className={`transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
            {children}
        </div>
    );
};

// =================================================================
// 3. COMPONENTE PRINCIPAL
// =================================================================
const LeiturasAtuais = () => {
    const [books, setBooks ] = useState<Book[]>([]);
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
    const [isLeaving, setIsLeaving] = useState(false);

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
            const res = await fetch('/api/books?status=READING');
            if (!res.ok) throw new Error('Erro ao buscar livros');
            const data: Book[] = await res.json();

            // Filtra apenas os livros com status 'reading'
            const readingBooks = data.filter(book => book.status === 'Lendo');
            setBooks(readingBooks);

            // Atualiza estatísticas gerais
            const paginasHoje = readingBooks.reduce((acc, book) => acc + book.finishedPages, 0);
            setReadingData(prev => ({ ...prev, paginasHoje }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchReadingBooks();
}, []);


    const navigateWithTransition = (path: string) => {
        setIsLeaving(true);
        setIsVisible(false);
        setTimeout(() => {
            alert(`Navegação simulada para: ${path === '/' ? 'Home' : path}`);
        }, 400);
    };

    const openUpdateModal = (bookId: number) => {
        setSelectedBook(bookId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPagesRead('');
        setReadingTime('');
    };

            setCurrentReadings(readings);
            setStats(stats);

            if (readings.length > 0) {
                setMainReading(readings[0]);
                setIsPaused(readings[0].isPaused);
            } else setMainReading(null);

    const handleSubmit = async () => {
        const pages = parseInt(pagesRead);
        if (!selectedBook || !pages) return;

         try {
            const res = await fetch(`/api/books/${selectedBook}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ finishedPages: pages })
            });
            if (!res.ok) throw new Error('Erro ao atualizar livro');

            // Atualiza localmente
            setBooks(prev =>
                prev.map(book =>
                    book.id === selectedBook
                        ? { ...book, finishedPages: book.finishedPages + pages }
                        : book
                )
            );

            setReadingData(prev => ({ ...prev, paginasHoje: prev.paginasHoje + pages }));

            showFeedback(`Progresso atualizado! +${pages} páginas`);
            closeModal();
        } catch (err) {
            console.error(err);
            showFeedback('Erro ao atualizar livro.');
            }
        };

        const togglePause = () => {
        setIsPaused(!isPaused);
        showFeedback(!isPaused ? 'Leitura pausada.' : 'Leitura retomada!');
    };

    if (loading) return <p className="text-center mt-20 text-gray-600">Carregando livros...</p>;

    return (
        <div className={`min-h-screen transition-all duration-500 ${isLeaving ? 'opacity-0' : 'opacity-100'}`}>

            <div className="flex items-center justify-center min-h-screen" style={{ margin: '0.5rem' }}>
                <div className="w-full max-w-4xl mx-auto" style={{ padding: '20px 10px' }}>

                    {/* Título da Página com animação */}
                    <PageTransition isVisible={isVisible}>
                        <div className="text-center" style={{ marginBottom: '32px' }}>
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-blue-400 transform transition-all duration-700" style={{ marginBottom: '8px' }}>
                                Leituras Atuais
                            </h1>
                            <p className="text-sm md:text-lg text-gray-600 dark:text-blue-200 transition-all duration-700 delay-200" style={{ padding: '0 16px' }}>
                                Acompanhe seu progresso e mantenha o foco nos livros que está lendo
                            </p>
                        </div>
                    </PageTransition>

                    {/* Estatísticas com animação escalonada - USANDO O NOVO ESTADO 'stats' */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" style={{ marginBottom: '32px' }}>
                        {[
                            { icon: BookOpen, value: stats.pagesToday, label: 'Páginas Hoje', color: 'from-blue-500 to-cyan-500', animationClass: 'hover:animate-bounce' },
                            { icon: Calendar, value: stats.consecutiveDays, label: 'Dias Consecutivos', color: 'from-emerald-500 to-teal-500', animationClass: 'hover:animate-pulse' },
                            { icon: TrendingUp, value: stats.weeklyPace, label: 'Páginas/Semana', color: 'from-purple-500 to-pink-500', animationClass: 'hover:animate-ping' },
                            { icon: Clock, value: stats.averageTimeMin, label: 'Min/Sessão', color: 'from-orange-500 to-red-500', animationClass: 'hover:animate-spin' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 dark:bg-transparent dark:border-transparent dark:shadow-[#3b82f6] hover:-translate-y-2 text-center border border-gray-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
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
                                <div className="text-lg md:text-2xl font-bold text-gray-800 dark:text-blue-600 transition-all duration-300" style={{ marginBottom: '4px' }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 dark:text-blue-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Card do Livro com animação - USANDO O NOVO ESTADO 'mainReading' */}
                    <PageTransition isVisible={isVisible}>
                        <div className="bg-white dark:bg-blue-200/10 dark:border-blue-400 rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-lg" style={{ padding: '20px md:40px' }}>
                            <div className="text-center" style={{ marginBottom: '1rem', padding: '1rem' }}>
                                <h2 className="text-xl md:text-2xl font-semibold flex dark:text-blue-400 items-center justify-center gap-3 text-gray-800">
                                    <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-600 transition-all duration-300" />
                                    Livros em Andamento
                                </h2>
                            </div>

                            {mainReading ? (
                                <div className="max-w-7xl mx-auto flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 transition-all duration-500 hover:shadow-lg w-full max-w-2xl" style={{ marginBottom: '1rem', padding: '2rem' }}>

                                        {/* Informações do Livro */}
                                        <div className="text-center" style={{ marginBottom: '24px' }}>
                                            <div
                                                className="w-16 h-20 md:w-20 md:h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                                style={{ marginBottom: '16px', padding: '6px md:8px' }}
                                            >
                                                {/* Exibindo as primeiras letras do título */}
                                                {mainReading.book.title.toUpperCase().substring(0, 10).split(' ').join('<br/>')}
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-blue-400 transition-all duration-300" style={{ marginBottom: '4px' }}>
                                                {mainReading.book.title}
                                            </h3>
                                            <p className="text-base md:text-lg text-gray-600 dark:text-blue-200 transition-all duration-300" style={{ marginBottom: '12px' }}>
                                                {mainReading.authorName}
                                            </p>

                                            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm text-gray-600">
                                                <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600">
                                                    📅 <strong>Iniciado:</strong> {new Date(mainReading.startedAt).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600">
                                                    ⏱️ <strong>Previsão:</strong> 5 Out 2024
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status de Pausa */}
                                        {isPaused && (
                                            <div className="bg-orange-100 border-l-4 border-orange-400 text-orange-700 text-center font-medium rounded-r-lg transition-all duration-500 transform hover:scale-105 text-sm md:text-base" style={{ padding: '12px md:16px', marginBottom: '20px' }}>
                                                📚 Leitura pausada - Clique em &quot;Retomar&quot; para continuar
                                            </div>
                                        )}

                                        {/* Progresso */}
                                        <div style={{ marginBottom: '28px' }}>
                                            <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
                                                <span className="text-gray-700 dark:text-blue-500 font-medium transition-all duration-300 text-sm md:text-base">
                                                    {mainReading.currentPage} de {mainReading.book.pages} páginas
                                                </span>
                                                <span className="font-bold text-blue-600 text-lg md:text-xl transition-all duration-500">
                                                    {mainReading.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                                                    style={{ width: `${mainReading.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Botões */}
                                        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-3">
                                            <button
                                                onClick={openUpdateModal} // CORRIGIDO: Removido o argumento bookTitle
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95 sm:col-span-2 md:col-span-1"
                                                style={{ padding: '10px 14px' }}
                                                disabled={isPaused}
                                            >
                                                <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Atualizar Progresso</span>
                                                <span className="md:hidden">Atualizar</span>
                                            </button>

                                            <button
                                                onClick={() => { setNoteMode('write'); setIsNoteModalOpen(true); }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Fazer Anotação</span>
                                                <span className="md:hidden">Anotar</span>
                                            </button>

                                            <button
                                                onClick={() => { setNoteMode('view'); setIsNoteModalOpen(true); }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Ver Anotações</span>
                                                <span className="md:hidden">Anotações</span>
                                            </button>

                                            <button
                                                onClick={togglePause}
                                                className={`${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95`}
                                                style={{ padding: '10px 14px' }}
                                            >
                                                {isPaused ? <Play className="w-4 h-4 transition-transform duration-300" /> : <Pause className="w-4 h-4 transition-transform duration-300" />}
                                                {isPaused ? 'Retomar' : 'Pausar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 text-gray-500 dark:text-blue-300">
                                    {currentReadings.length === 0 ? "Carregando dados..." : "Nenhuma leitura em andamento. Adicione um livro para começar!"}
                                </div>
                            )}
                        </div>
                    </PageTransition>
                </div>

                {/* Modal de Progresso com animação - Responsivo */}
                {isModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-slideInUp" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800">Atualizar: {mainReading?.book.title || 'Livro'}</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Páginas lidas hoje:
                                    </label>
                                    <input
                                        type="number"
                                        value={pagesRead}
                                        onChange={(e) => setPagesRead(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                                        style={{ padding: '10px 14px' }}
                                        placeholder="Ex: 15"
                                        min={1}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                        Tempo de leitura (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={readingTime}
                                        onChange={(e) => setReadingTime(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                                        style={{ padding: '10px 14px' }}
                                        placeholder="Ex: 30"
                                        min={1}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3" style={{ paddingTop: '12px' }}>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                        style={{ padding: '10px 14px' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105"
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
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform animate-slideInUp" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                    {noteMode === 'write' ? 'Fazer Anotação' : 'Minhas Anotações'}
                                </h3>
                                <button onClick={closeNoteModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {noteMode === 'write' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                            Suas reflexões sobre &quot;{mainReading?.book.title || 'o livro'}&quot;:
                                        </label>
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none focus:scale-105"
                                            style={{ padding: '12px', minHeight: '120px' }}
                                            placeholder="Escreva suas impressões, citações favoritas, análises do capítulo..."
                                            rows={6}
                                        />
                                        <div className="flex gap-3" style={{ marginTop: '12px' }}>
                                            <button
                                                onClick={closeNoteModal}
                                                className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={saveNote}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                                style={{ padding: '10px 14px' }}
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 min-h-[120px] transition-all duration-300 hover:border-gray-400" style={{ padding: '16px' }}>
                                        {noteText ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600" style={{ marginBottom: '12px' }}>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span>Suas anotações salvas</span>
                                                </div>
                                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                                                    {noteText}
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:bg-gray-300">
                                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium mb-1 text-sm">Nenhuma anotação ainda</p>
                                                <p className="text-gray-400 text-xs">Suas anotações aparecerão aqui quando salvas</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback com animação melhorada - Responsivo (Mantido) */}
                {feedback && (
                    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 bg-green-500 text-white rounded-lg shadow-lg z-50 font-medium transform animate-slideInRight text-center sm:text-left max-w-sm mx-auto sm:mx-0" style={{ padding: '14px 18px' }}>
                        {feedback}
                    </div>
                )}
            </div>

            {/* CSS personalizado para animações (Mantido) */}
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
