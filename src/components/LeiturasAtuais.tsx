'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, TrendingUp, Edit, StickyNote, Pause, X, Play } from 'lucide-react';

// Componente de transição para páginas
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
    const [readingData, setReadingData] = useState({
        paginasHoje: 25,
        diasConsecutivos: 7,
        ritmoSemanal: 180,
        tempoMedio: 45
    });

    // Estado removido pois não é usado nesta versão demonstrativa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState('');
    const [pagesRead, setPagesRead] = useState('');
    const [readingTime, setReadingTime] = useState('');
    const [noteText, setNoteText] = useState('');
    const [bookProgress, setBookProgress] = useState({
        currentPage: 150,
        totalPages: 250,
        percentage: 60
    });
    const [feedback, setFeedback] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [noteMode, setNoteMode] = useState<'write' | 'view'>('write');
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // Animação de entrada da página
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Função para navegação com transição (simulada)
    const navigateWithTransition = (path: string) => {
        setIsLeaving(true);
        setIsVisible(false);

        setTimeout(() => {
            // Em um projeto real, aqui você faria: router.push(path);
            console.log(`Navegando para: ${path}`);
            // Para demonstração, vamos apenas mostrar um alert
            alert(`Navegação simulada para: ${path === '/' ? 'Home' : path}`);
        }, 400);
    };

    const openUpdateModal = (bookTitle: string) => {
        setSelectedBook(bookTitle);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBook('');
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

    const handleSubmit = () => {
        const pages = parseInt(pagesRead);
        const time = parseInt(readingTime);

        if (pages && time) {
            setReadingData(prev => ({
                ...prev,
                paginasHoje: prev.paginasHoje + pages
            }));

            setBookProgress(prev => {
                const newCurrentPage = Math.min(prev.currentPage + pages, prev.totalPages);
                const newPercentage = Math.round((newCurrentPage / prev.totalPages) * 100);
                return {
                    ...prev,
                    currentPage: newCurrentPage,
                    percentage: newPercentage
                };
            });

            closeModal();
            showFeedback(`Progresso atualizado! +${pages} páginas lidas`);
        }
    };

    const showFeedback = (message: string) => {
        setFeedback(message);
        setTimeout(() => setFeedback(''), 3000);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
        if (!isPaused) {
            showFeedback('Leitura pausada. Você pode retomar a qualquer momento!');
        } else {
            showFeedback('Leitura retomada! Continue sua jornada literária!');
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${isLeaving ? 'opacity-0' : 'opacity-100'}`}>
            {/* Botão Voltar para Home com transição */}
            <PageTransition isVisible={isVisible}>
                <div style={{ margin: '1rem' }}>
                    <button
                        onClick={() => navigateWithTransition('/')}
                        className="px-4 py-2 text-blue-600 rounded-lg hover:underline transition-all duration-300 hover:bg-blue-50 cursor-pointer transform hover:scale-105"
                    >
                        ← Voltar para Home
                    </button>
                </div>
            </PageTransition>

            <div className="flex items-center justify-center min-h-screen" style={{ margin: '2rem' }}>
                <div className="w-full max-w-4xl mx-auto" style={{ padding: '40px 20px' }}>

                    {/* Título da Página com animação */}
                    <PageTransition isVisible={isVisible}>
                        <div className="text-center" style={{ marginBottom: '48px' }}>
                            <h1 className="text-4xl font-bold text-gray-800 transform transition-all duration-700" style={{ marginBottom: '12px' }}>
                                Leituras Atuais
                            </h1>
                            <p className="text-lg text-gray-600 transition-all duration-700 delay-200">
                                Acompanhe seu progresso e mantenha o foco nos livros que está lendo
                            </p>
                        </div>
                    </PageTransition>

                    {/* Estatísticas com animação escalonada */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '48px' }}>
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
                                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 text-center border border-gray-100 transform ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                    }`}
                                style={{
                                    padding: '24px',
                                    transitionDelay: `${index * 150}ms`
                                }}
                            >
                                <div
                                    className={`w-12 h-12 mx-auto bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center transition-all duration-300`}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <stat.icon className={`w-6 h-6 text-white transition-all duration-200 ${stat.animationClass}`} />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 transition-all duration-300" style={{ marginBottom: '6px' }}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Card do Livro com animação */}
                    <PageTransition isVisible={isVisible}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-lg" style={{ padding: '40px' }}>
                            <div className="text-center" style={{ marginBottom: '32px' }}>
                                <h2 className="text-2xl font-semibold flex items-center justify-center gap-3 text-gray-800">
                                    <BookOpen className="w-7 h-7 text-blue-600 transition-all duration-300" />
                                    Livros em Andamento
                                </h2>
                            </div>

                            <div className="max-w-7xl mx-auto flex items-center justify-center">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 transition-all duration-500 hover:shadow-md" style={{ padding: '32px' }}>

                                    {/* Informações do Livro */}
                                    <div className="text-center" style={{ marginBottom: '32px' }}>
                                        <div
                                            className="w-20 h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                            style={{ marginBottom: '20px', padding: '8px' }}
                                        >
                                            DOM<br />CASMURRO
                                        </div>

                                        <h3 className="text-2xl font-semibold text-gray-800 transition-all duration-300" style={{ marginBottom: '6px' }}>
                                            Dom Casmurro
                                        </h3>
                                        <p className="text-lg text-gray-600 transition-all duration-300" style={{ marginBottom: '16px' }}>
                                            Machado de Assis
                                        </p>

                                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                                            <span className="flex items-center gap-1 transition-all duration-300 hover:text-blue-600">
                                                📅 <strong>Iniciado:</strong> 15 Set 2024
                                            </span>
                                            <span className="flex items-center gap-1 transition-all duration-300 hover:text-blue-600">
                                                ⏱️ <strong>Previsão:</strong> 5 Out 2024
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status de Pausa */}
                                    {isPaused && (
                                        <div className="bg-orange-100 border-l-4 border-orange-400 text-orange-700 text-center font-medium rounded-r-lg transition-all duration-500 transform hover:scale-105" style={{ padding: '16px', marginBottom: '24px' }}>
                                            📚 Leitura pausada - Clique em &quot;Retomar&quot; para continuar
                                        </div>
                                    )}

                                    {/* Progresso */}
                                    <div style={{ marginBottom: '32px' }}>
                                        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                                            <span className="text-gray-700 font-medium transition-all duration-300">
                                                {bookProgress.currentPage} de {bookProgress.totalPages} páginas
                                            </span>
                                            <span className="font-bold text-blue-600 text-xl transition-all duration-500">
                                                {bookProgress.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                                                style={{ width: `${bookProgress.percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Botões de Ação com animações */}
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={() => openUpdateModal('Dom Casmurro')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ padding: '0.3rem 0.9rem' }}
                                            disabled={isPaused}
                                        >
                                            <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                            Atualizar Progresso
                                        </button>

                                        <button
                                            onClick={() => { setNoteMode('write'); setIsNoteModalOpen(true); }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center gap-2 font-medium cursor-pointer"
                                            style={{ padding: '0.3rem 0.9rem' }}
                                        >
                                            <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                            Fazer Anotação
                                        </button>

                                        <button
                                            onClick={() => { setNoteMode('view'); setIsNoteModalOpen(true); }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center gap-2 font-medium cursor-pointer"
                                            style={{ padding: '0.3rem 0.9rem' }}
                                        >
                                            <StickyNote className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                            Minhas Anotações
                                        </button>

                                        <button
                                            onClick={togglePause}
                                            className={`${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center gap-2 font-medium cursor-pointer`}
                                            style={{ padding: '12px 20px' }}
                                        >
                                            {isPaused ? <Play className="w-4 h-4 transition-transform duration-300" /> : <Pause className="w-4 h-4 transition-transform duration-300" />}
                                            {isPaused ? 'Retomar' : 'Pausar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageTransition>
                </div>

                {/* Modal de Progresso com animação */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '20px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-slideInUp" style={{ padding: '32px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                <h3 className="text-xl font-semibold text-gray-800">Atualizar: {selectedBook}</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                        Páginas lidas hoje:
                                    </label>
                                    <input
                                        type="number"
                                        value={pagesRead}
                                        onChange={(e) => setPagesRead(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                                        style={{ padding: '12px 16px' }}
                                        placeholder="Ex: 15"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                        Tempo de leitura (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={readingTime}
                                        onChange={(e) => setReadingTime(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                                        style={{ padding: '12px 16px' }}
                                        placeholder="Ex: 30"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3" style={{ paddingTop: '16px' }}>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                        style={{ padding: '12px 16px' }}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Anotação com animação */}
                {isNoteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" style={{ padding: '20px' }}>
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform animate-slideInUp" style={{ padding: '32px' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {noteMode === 'write' ? 'Fazer Anotação' : 'Minhas Anotações'}
                                </h3>
                                <button onClick={closeNoteModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {noteMode === 'write' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
                                            Suas reflexões sobre &quot;Dom Casmurro&quot;:
                                        </label>
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none focus:scale-105"
                                            style={{ padding: '16px', minHeight: '120px' }}
                                            placeholder="Escreva suas impressões, citações favoritas, análises do capítulo..."
                                            rows={6}
                                        />
                                        <div className="flex gap-3 mt-3">
                                            <button
                                                onClick={closeNoteModal}
                                                className="flex-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                                style={{ padding: '12px 16px' }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={saveNote}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer hover:scale-105"
                                                style={{ padding: '12px 16px' }}
                                            >
                                                Salvar Anotação
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 min-h-[120px] transition-all duration-300 hover:border-gray-400" style={{ padding: '20px' }}>
                                        {noteText ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span>Suas anotações salvas</span>
                                                </div>
                                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
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
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:bg-gray-300">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium mb-1">Nenhuma anotação ainda</p>
                                                <p className="text-gray-400 text-sm">Suas anotações aparecerão aqui quando salvas</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback com animação melhorada */}
                {feedback && (
                    <div className="fixed top-6 right-6 bg-green-500 text-white rounded-lg shadow-lg z-50 font-medium transform animate-slideInRight" style={{ padding: '16px 24px' }}>
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
            `}</style>
        </div>
    );
};

export default LeiturasAtuais;