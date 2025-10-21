'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, TrendingUp, Edit, StickyNote, Pause, X, Play } from 'lucide-react';
import FloatingTimer from './FloatingTimer';

type Book = {
    id: number;
    title: string;
    author: string;
    pages: number;
    finishedPages: number;
    startedAt: string;
    predictedEnd?: string;
    status: string;
    readingId?: number;
    cover?: string;
};

type Note = {
    id: number;
    content: string;
    createdAt: string;
    pageReference?: number;
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
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

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
    const [isPaused, setIsPaused] = useState<Record<number, boolean>>({});
    const [noteMode, setNoteMode] = useState<'write' | 'view'>('write');
    const [dailyGoal, setDailyGoal] = useState<number>(20);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [activeTimer, setActiveTimer] = useState<{
        bookId: number;
        bookTitle: string;
    } | null>(null);
    const [timerMinutes, setTimerMinutes] = useState(0);

    // Função para calcular previsão de término
    const calculatePrediction = (book: Book) => {
        if (!book.pages || !dailyGoal || dailyGoal <= 0) return 'Defina uma meta';

        const pagesLeft = book.pages - (book.finishedPages || 0);
        if (pagesLeft <= 0) return 'Concluído!';

        const daysLeft = Math.ceil(pagesLeft / dailyGoal);
        const predictedDate = new Date();
        predictedDate.setDate(predictedDate.getDate() + daysLeft);

        return predictedDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Carregar meta diária e estados de pausa do localStorage
        const savedGoal = localStorage.getItem('dailyReadingGoal');
        if (savedGoal) setDailyGoal(parseInt(savedGoal));

        const savedPauses = localStorage.getItem('pausedBooks');
        if (savedPauses) setIsPaused(JSON.parse(savedPauses));

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchReadingBooks = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('Token não encontrado');
                    setLoading(false);
                    return;
                }

                const res = await fetch('/api/books?status=Lendo', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Erro ao buscar livros');
                const data: Book[] = await res.json();

                const readingBooks = data.filter(book =>
                    book.status === 'Lendo'
                );

                await new Promise(resolve => setTimeout(resolve, 400));

                setBooks(readingBooks);

                setReadingData(prev => ({ ...prev, paginasHoje: 0 }));

                setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(() => setLoading(false), 600);
                }, 300);

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchReadingBooks();
    }, []);


    const openUpdateModal = (bookId: number) => {
        const book = books.find(b => b.id === bookId);
        setSelectedBook(bookId);
        setPagesRead(book?.finishedPages?.toString() || '0');

        // 🔥 NOVO: Se há timer ativo, preenche o tempo automaticamente
        if (timerMinutes > 0) {
            setReadingTime(timerMinutes.toString());
        }

        setIsModalOpen(true);
    };

    const handleStartTimer = (bookId: number, bookTitle: string) => {
        setActiveTimer({ bookId, bookTitle });
    };

    const handleStopTimer = (totalMinutes: number) => {
        setTimerMinutes(totalMinutes);
        setActiveTimer(null);

        showFeedback(`⏱️ Sessão concluída: ${totalMinutes} minutos`);

        // Abrir modal de progresso automaticamente
        if (activeTimer) {
            setTimeout(() => {
                openUpdateModal(activeTimer.bookId);
            }, 500);
        }
    };

    const handleCloseTimer = () => {
        setActiveTimer(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPagesRead('');
        setReadingTime('');
    };

    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
        setNoteText('');
        setEditingNoteId(null);
    };

    const saveNote = async () => {
        if (!noteText.trim() || !selectedBook) {
            showFeedback('Por favor, escreva algo antes de salvar.');
            return;
        }

        try {
            const readingRes = await fetch(`/api/books/${selectedBook}/reading`);

            if (!readingRes.ok) {
                showFeedback('Inicie a leitura antes de fazer anotações (atualize o progresso primeiro).');
                return;
            }

            const readingData = await readingRes.json();
            const readingId = readingData.readingId;

            if (!readingId) {
                showFeedback('Inicie a leitura antes de fazer anotações (atualize o progresso primeiro).');
                return;
            }

            if (editingNoteId) {
                const res = await fetch(`/api/reading-notes/${editingNoteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: noteText }),
                });

                if (!res.ok) throw new Error('Erro ao editar');

                showFeedback('Anotação editada com sucesso!');
            } else {
                const res = await fetch('/api/reading-notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ readingId, content: noteText }),
                });

                if (!res.ok) throw new Error('Erro ao salvar');

                showFeedback('Anotação salva com sucesso!');
            }

            await fetchNotes();
            setNoteText('');
            setEditingNoteId(null);
            closeNoteModal();
        } catch (err) {
            console.error(err);
            showFeedback('Erro ao salvar anotação.');
        }
    };

    const fetchNotes = async () => {
        if (!selectedBook) return;

        try {
            const readingRes = await fetch(`/api/books/${selectedBook}/reading`);

            if (!readingRes.ok) {
                setNotes([]);
                return;
            }

            const { readingId } = await readingRes.json();

            if (!readingId) {
                setNotes([]);
                return;
            }

            const res = await fetch(`/api/reading-notes?readingId=${readingId}`);
            if (!res.ok) throw new Error('Erro ao buscar anotações');

            const data: Note[] = await res.json();
            setNotes(data);
        } catch (err) {
            console.error(err);
            showFeedback('Erro ao carregar anotações.');
            setNotes([]);
        }
    };

    const deleteNote = async (noteId: number) => {
        if (!confirm('Tem certeza que deseja deletar esta anotação?')) return;

        try {
            const res = await fetch(`/api/reading-notes/${noteId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erro ao deletar');

            showFeedback('Anotação deletada com sucesso!');
            await fetchNotes();
        } catch (err) {
            console.error(err);
            showFeedback('Erro ao deletar anotação.');
        }
    };

    const startEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setNoteText(note.content);
        setNoteMode('write');
    };

    const handleSubmit = async () => {
        const newTotalPages = parseInt(pagesRead);
        const timeMin = parseInt(readingTime);

        if (!selectedBook) {
            showFeedback('Nenhum livro selecionado.');
            return;
        }

        if (isNaN(newTotalPages) || newTotalPages < 0) {
            showFeedback('Por favor, insira um número válido de páginas.');
            return;
        }

        if (isNaN(timeMin) || timeMin < 1) {
            showFeedback('Por favor, insira um tempo de leitura válido.');
            return;
        }

        const book = books.find(b => b.id === selectedBook);
        if (!book) {
            showFeedback('Livro não encontrado.');
            return;
        }

        if (newTotalPages > book.pages) {
            showFeedback(`O livro tem apenas ${book.pages} páginas.`);
            return;
        }

        if (newTotalPages < (book.finishedPages || 0)) {
            showFeedback(`Você já leu ${book.finishedPages} páginas. O novo valor deve ser maior ou igual.`);
            return;
        }

        try {
            const paginasLidasAgora = newTotalPages - (book.finishedPages || 0);
            const isCompleted = newTotalPages >= book.pages;

            const res = await fetch('/api/current-readings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: selectedBook,
                    pagesRead: paginasLidasAgora,
                    currentPage: newTotalPages,
                    readingTimeMin: timeMin
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao atualizar');
            }

            // Se concluído, atualizar status para READ
            if (isCompleted) {
                const token = localStorage.getItem('token');

                // 🔥 1. Buscar as notas pessoais ORIGINAIS do livro
                const bookRes = await fetch(`/api/books/${selectedBook}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                let originalNotes = '';
                if (bookRes.ok) {
                    const bookData = await bookRes.json();
                    originalNotes = bookData.notes || '';
                }

                // 🔥 2. Buscar todas as anotações feitas durante a leitura
                const readingRes = await fetch(`/api/books/${selectedBook}/reading`);
                let readingNotesFormatted = '';

                if (readingRes.ok) {
                    const { readingId } = await readingRes.json();

                    if (readingId) {
                        const notesRes = await fetch(`/api/reading-notes?readingId=${readingId}`);
                        if (notesRes.ok) {
                            const notesData = await notesRes.json();

                            if (notesData.length > 0) {
                                // Formata as anotações de leitura
                                readingNotesFormatted = notesData.map((note: Note) => {
                                    const date = new Date(note.createdAt).toLocaleDateString('pt-BR');
                                    return `[${date}] ${note.content}`;
                                }).join('\n\n---\n\n');
                            }
                        }
                    }
                }

                // 🔥 3. MESCLA: Notas Pessoais + Anotações da Leitura
                let finalNotes = '';

                if (originalNotes && readingNotesFormatted) {
                    // Se existem ambas, separa claramente
                    finalNotes = `📝 NOTAS PESSOAIS:\n${originalNotes}\n\n${'='.repeat(50)}\n\n📖 ANOTAÇÕES DA LEITURA:\n\n${readingNotesFormatted}`;
                } else if (originalNotes) {
                    // Só tem notas pessoais
                    finalNotes = originalNotes;
                } else if (readingNotesFormatted) {
                    // Só tem anotações de leitura
                    finalNotes = readingNotesFormatted;
                }

                // Atualiza o status E adiciona todas as notas mescladas
                const statusRes = await fetch(`/api/books/${selectedBook}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: 'Lido',
                        notes: finalNotes // 🔥 Salva TUDO junto
                    })
                });

                if (statusRes.ok) {
                    showFeedback('🎉 Parabéns! Livro concluído e suas anotações foram salvas!');
                    setBooks(prev => prev.filter(b => b.id !== selectedBook));

                    window.dispatchEvent(new CustomEvent('bookUpdated', {
                        detail: { bookId: selectedBook, action: 'completed' }
                    }));

                    closeModal();
                    return;
                }
            }

            // 🔥 RECARREGAR OS DADOS ATUALIZADOS DO SERVIDOR
            const token = localStorage.getItem('token');
            const updatedBooksRes = await fetch('/api/books?status=Lendo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (updatedBooksRes.ok) {
                const updatedData: Book[] = await updatedBooksRes.json();
                const readingBooks = updatedData.filter(book => book.status === 'Lendo');
                setBooks(readingBooks); // 🔥 Atualiza com dados frescos do servidor
            }

            if (paginasLidasAgora > 0) {
                setReadingData(prev => ({
                    ...prev,
                    paginasHoje: prev.paginasHoje + paginasLidasAgora,
                    tempoMedio: prev.tempoMedio + timeMin
                }));
            }

            showFeedback(`✅ ${paginasLidasAgora} páginas lidas em ${timeMin} min!`);
            closeModal();
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar livro.';
            showFeedback(errorMessage);
        }
    };

    const togglePause = (bookId: number) => {
        setIsPaused(prev => {
            const newState = { ...prev, [bookId]: !prev[bookId] };
            localStorage.setItem('pausedBooks', JSON.stringify(newState));
            return newState;
        });
        showFeedback(!isPaused[bookId] ? 'Leitura pausada.' : 'Leitura retomada!');
    };

    if (loading) return (
        <div
            className={`flex flex-col items-center justify-center text-center space-y-6 transition-all duration-700 ease-in-out ${fadeOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
            style={{
                height: '100vh',
                margin: 0,
                padding: 0,
            }}
        >
            <div className="flex space-x-3">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-500 wood:bg-[var(--color-accent-400)] animate-[bounce_1.4s_infinite_ease-in-out]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-blue-400 wood:bg-[var(--color-accent-300)] animate-[bounce_1.4s_infinite_ease-in-out_0.2s]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-blue-300 wood:bg-[var(--color-accent-200)] animate-[bounce_1.4s_infinite_ease-in-out_0.4s]"></div>
            </div>

            <p
                className="font-medium text-lg tracking-wide text-blue-600 dark:text-blue-400 wood:text-[var(--color-accent-400)]"
                style={{
                    animation: 'fade 2.5s ease-in-out infinite',
                }}
            >
                Preparando seus livros...
            </p>

            <style jsx>{`
      @keyframes fade {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `}</style>
        </div>
    );

    return (
        <div className={`min-h-screen transition-all duration-500 ${isLeaving ? 'opacity-0' : 'opacity-100'} dark:bg-slate-900 wood:bg-[var(--color-background)]`}>

            <div className="flex items-center justify-center min-h-screen" style={{ margin: '0.5rem' }}>
                <div className="w-full max-w-4xl mx-auto" style={{ padding: '20px 10px' }}>

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
                                    <div className="text-center" style={{ marginBottom: '24px' }}>
                                        {/* 🔥 CAPA DO LIVRO - CORRIGIDO */}
                                        {book.cover ? (
                                            <img
                                                src={book.cover}
                                                alt={`Capa de ${book.title}`}
                                                className="w-20 h-28 md:w-24 md:h-36 object-cover rounded-lg mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-gray-200 dark:border-slate-600 wood:border-primary-700"
                                                style={{ marginBottom: '16px' }}
                                                onError={(e) => {
                                                    // Se a imagem falhar, esconde ela e mostra o fallback
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const fallback = target.nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback com iniciais - só aparece se não houver cover */}
                                        <div
                                            className={`w-16 h-20 md:w-20 md:h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-blue-500 dark:to-indigo-500 wood:from-primary-600 wood:to-primary-800 ${book.cover ? 'hidden' : ''}`}
                                            style={{ marginBottom: '16px', padding: '6px md:8px' }}
                                        >
                                            {book.title.substring(0, 3).toUpperCase()}
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 transition-all duration-300 dark:text-blue-100 wood:text-[var(--color-foreground)]" style={{ marginBottom: '4px' }}>
                                            {book.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-gray-600 transition-all duration-300 dark:text-blue-300 wood:text-primary-200" style={{ marginBottom: '12px' }}>
                                            {book.author}
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm text-gray-600 dark:text-blue-300 wood:text-primary-300">
                                            <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 wood:hover:text-accent-400">
                                                📅 <strong>Iniciado:</strong> {
                                                    book.startedAt
                                                        ? new Date(book.startedAt).toLocaleDateString('pt-BR', {
                                                            timeZone: 'America/Sao_Paulo' // 🔥 Use seu timezone
                                                        })
                                                        : 'Não definido'
                                                }
                                            </span>
                                            <span className="flex items-center justify-center gap-1 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 wood:hover:text-accent-400">
                                                ⏱️ <strong>Previsão:</strong> {calculatePrediction(book)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setIsGoalModalOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-105 font-medium text-xs sm:text-sm dark:bg-blue-500 dark:hover:bg-blue-600 wood:bg-primary-600 wood:hover:bg-primary-700"
                                            style={{ padding: '0.4rem 0.8rem', marginTop: '0.8rem' }}
                                        >
                                            Meta atual: {dailyGoal} páginas/dia (clique para alterar)
                                        </button>

                                    </div>

                                    {isPaused[book.id] && (
                                        <div className="bg-orange-100 border-l-4 border-orange-400 text-orange-700 text-center font-medium rounded-r-lg transition-all duration-500 transform hover:scale-105 text-sm md:text-base dark:bg-orange-900/30 dark:border-orange-500 dark:text-orange-300 wood:bg-accent-800/30 wood:border-accent-600 wood:text-accent-200" style={{ padding: '12px md:16px', marginBottom: '20px' }}>
                                            📚 Leitura pausada - Clique em &quot;Retomar&quot; para continuar
                                        </div>
                                    )}

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

                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                onClick={() => openUpdateModal(book.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600 wood:bg-primary-600 wood:hover:bg-primary-700"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                                disabled={isPaused[book.id]}
                                            >
                                                <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Atualizar Progresso</span>
                                                <span className="md:hidden">Atualizar</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedBook(book.id);
                                                    setNoteMode('write');
                                                    setIsNoteModalOpen(true);
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600 wood:bg-secondary-600 wood:hover:bg-secondary-700"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Fazer Anotação</span>
                                                <span className="md:hidden">Anotar</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedBook(book.id);
                                                    setNoteMode('view');
                                                    setIsNoteModalOpen(true);
                                                    fetchNotes();
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600 wood:bg-primary-700 wood:hover:bg-primary-800"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                            >
                                                <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                <span className="hidden md:inline">Ver Anotações</span>
                                                <span className="md:hidden">Anotações</span>
                                            </button>

                                            <button
                                                onClick={() => handleStartTimer(book.id, book.title)}
                                                disabled={!!activeTimer || isPaused[book.id]}
                                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-purple-500 dark:hover:bg-purple-600 wood:bg-primary-500 wood:hover:bg-primary-600"
                                                style={{ padding: '0.5rem 0.9rem' }}
                                            >
                                                <Clock className="w-4 h-4" />
                                                <span className="hidden md:inline">Iniciar Sessão</span>
                                                <span className="md:hidden">Sessão</span>
                                            </button>


                                            <button
                                                onClick={() => togglePause(book.id)}
                                                className={`${isPaused[book.id] ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 wood:bg-secondary-500 wood:hover:bg-secondary-600' : 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 wood:bg-accent-600 wood:hover:bg-accent-700'} text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2 font-medium cursor-pointer text-xs sm:text-sm active:scale-95 w-full md:w-auto mx-auto`}
                                                style={{ padding: '10px 14px' }}
                                            >
                                                {isPaused[book.id] ? <Play className="w-4 h-4 transition-transform duration-300" /> : <Pause className="w-4 h-4 transition-transform duration-300" />}
                                                {isPaused[book.id] ? 'Retomar' : 'Pausar'}
                                            </button>
                                        </div>
                                    </div>



                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-blue-300 wood:text-primary-300">Nenhum livro em andamento</p>
                        )}
                    </div>
                </div>

                {isModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-slideInUp dark:bg-slate-800 wood:bg-primary-900" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">Atualizar Progresso</h3>
                                <button onClick={closeModal} className="hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 dark:hover:bg-slate-700 wood:hover:bg-primary-800" style={{ padding: '0.5rem' }}>
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
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-200 wood:border-primary-100 wood:text-secondary-600 wood:focus:ring-accent-600"
                                        style={{ padding: '10px 14px' }}
                                        placeholder={`Ex: ${books.find(b => b.id === selectedBook)?.finishedPages || 0}`}
                                        min={0}
                                        max={books.find(b => b.id === selectedBook)?.pages || 999}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-blue-400 wood:text-primary-400" style={{ marginTop: '0.25rem' }}>
                                        Progresso atual: {books.find(b => b.id === selectedBook)?.finishedPages || 0} páginas
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200" style={{ margin: '0.5rem 0 0.5rem 0' }}>
                                        Tempo de leitura (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={readingTime}
                                        onChange={(e) => setReadingTime(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-200 wood:text-secondary-600 wood:border-primary-100 wood:focus:ring-accent-600"
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

                {isNoteModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform animate-slideInUp dark:bg-slate-800 wood:bg-primary-900" style={{ padding: '24px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">
                                    {noteMode === 'write' ? (editingNoteId ? 'Editar Anotação' : 'Fazer Anotação') : 'Minhas Anotações'}
                                </h3>
                                <button
                                    onClick={() => {
                                        closeNoteModal();
                                        setEditingNoteId(null);
                                        setNoteText('');
                                    }}
                                    className="hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 dark:hover:bg-slate-700 wood:hover:bg-primary-800"
                                    style={{ padding: '0.5rem' }}
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-blue-300 wood:text-primary-300" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                {noteMode === 'write' ? (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200">
                                            {editingNoteId ? 'Edite sua anotação:' : 'Suas reflexões:'}
                                        </label>
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-200 wood:border-none wood:text-secondary-600 wood:focus:ring-primary-300"
                                            style={{ padding: '12px', height: '200px' }}
                                            placeholder="Escreva suas impressões, citações favoritas, análises..."
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    closeNoteModal();
                                                    setEditingNoteId(null);
                                                    setNoteText('');
                                                }}
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
                                                {editingNoteId ? 'Atualizar' : 'Salvar'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col">
                                        {notes.length > 0 ? (
                                            <>
                                                <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-blue-300 wood:text-primary-300">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse dark:bg-green-400 wood:bg-accent-500"></div>
                                                        <span>{notes.length} {notes.length === 1 ? 'anotação' : 'anotações'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setNoteMode('write')}
                                                        className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 dark:bg-emerald-500 wood:bg-secondary-600"
                                                        style={{ padding: '0.375rem 0.75rem' }}
                                                    >
                                                        + Nova
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800 wood:scrollbar-thumb-primary-600 wood:scrollbar-track-primary-900" style={{ maxHeight: '400px', paddingRight: '0.5rem' }}>
                                                    {notes.map((note) => (
                                                        <div
                                                            key={note.id}
                                                            className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:border-emerald-300 dark:from-slate-800/50 dark:to-slate-800/30 dark:border-slate-700 wood:from-primary-800/30 wood:to-primary-900/20 wood:border-primary-700"
                                                            style={{ padding: '1rem', margin: '1rem 0 1rem 0' }}
                                                        >
                                                            <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                                                                <span className="text-xs text-gray-500 dark:text-blue-400 wood:text-primary-400">
                                                                    {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => startEditNote(note)}
                                                                        className="text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 wood:text-accent-400"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteNote(note.id)}
                                                                        className="text-red-600 hover:text-red-700 transition-colors dark:text-red-400 wood:text-red-400"
                                                                        title="Deletar"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap dark:text-blue-100 wood:text-[var(--color-foreground)]">
                                                                {note.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center dark:bg-slate-700 wood:bg-primary-800" style={{ marginBottom: '1rem' }}>
                                                    <StickyNote className="w-8 h-8 text-gray-400 dark:text-blue-300 wood:text-primary-300" />
                                                </div>
                                                <p className="text-gray-500 font-medium dark:text-blue-300 wood:text-primary-300" style={{ marginBottom: '0.5rem' }}>Nenhuma anotação ainda</p>
                                                <p className="text-gray-400 text-sm dark:text-blue-400 wood:text-primary-400" style={{ marginBottom: '1rem' }}>Comece a registrar suas reflexões</p>
                                                <button
                                                    onClick={() => setNoteMode('write')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 dark:bg-emerald-500 wood:bg-secondary-600"
                                                    style={{ padding: '0.5rem 1rem' }}
                                                >
                                                    Criar primeira anotação
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {feedback && (
                    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 bg-green-500 text-white rounded-lg shadow-lg z-50 font-medium transform animate-slideInRight text-center sm:text-left max-w-sm mx-auto sm:mx-0 dark:bg-green-600 wood:bg-secondary-600" style={{ padding: '14px 18px' }}>
                        {feedback}
                    </div>
                )}

                {/* Modal de Meta Diária */}
                {isGoalModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '16px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-slideInUp dark:bg-slate-800 wood:bg-primary-900" style={{ padding: '24px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-blue-200 wood:text-[var(--color-foreground)]">Definir Meta Diária</h3>
                                <button
                                    onClick={() => setIsGoalModalOpen(false)}
                                    className="hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 dark:hover:bg-slate-700 wood:hover:bg-primary-800"
                                    style={{ padding: '0.5rem' }}
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-blue-300 wood:text-primary-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 wood:text-primary-200" style={{ marginBottom: '6px' }}>
                                        Quantas páginas você pretende ler por dia?
                                    </label>
                                    <input
                                        type="number"
                                        value={dailyGoal}
                                        onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105 dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-200 wood:border-primary-100 wood:text-secondary-600 wood:focus:ring-accent-600"
                                        style={{ padding: '10px 14px' }}
                                        placeholder="Ex: 20"
                                        min={1}
                                    />
                                    <p className="text-xs text-gray-500 dark:text-blue-400 wood:text-primary-400" style={{ marginTop: '0.5rem' }}>
                                        Esta meta será usada para calcular a previsão de término dos seus livros.
                                    </p>
                                </div>

                                <div className="flex gap-3" style={{ paddingTop: '12px' }}>
                                    <button
                                        onClick={() => setIsGoalModalOpen(false)}
                                        className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105 dark:border-slate-600 dark:text-blue-200 dark:hover:bg-slate-700 wood:border-primary-700 wood:text-primary-200 wood:hover:bg-primary-800/50"
                                        style={{ padding: '10px 14px' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('dailyReadingGoal', dailyGoal.toString());
                                            showFeedback(`✅ Meta definida: ${dailyGoal} páginas/dia`);
                                            setIsGoalModalOpen(false);
                                        }}
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
            </div>

            {/* 🔥 TIMER FLUTUANTE */}
            {activeTimer && (
                <FloatingTimer
                    bookId={activeTimer.bookId}
                    bookTitle={activeTimer.bookTitle}
                    onStop={handleStopTimer}
                    onClose={handleCloseTimer}
                />
            )}

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