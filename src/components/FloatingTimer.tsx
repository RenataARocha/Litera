'use client';
import { useState, useEffect, useRef } from 'react';
import { Clock, Pause, Play, Square, Minimize2, Maximize2, X } from 'lucide-react';

interface FloatingTimerProps {
    bookId: number;
    bookTitle: string;
    onStop: (totalMinutes: number) => void;
    onClose: () => void;
}

export default function FloatingTimer({ bookId, bookTitle, onStop, onClose }: FloatingTimerProps) {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const lastSaveRef = useRef(0);
    const intervalRef = useRef<number | null>(null);

    // Carregar tempo inicial
    useEffect(() => {
        const loadTime = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/reading-timer/${bookId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setSeconds(data.totalSeconds || 0);
                    setIsRunning(data.isTimerRunning || false);
                }
            } catch (err) {
                console.error('Erro ao carregar timer:', err);
            }
        };
        loadTime();
    }, [bookId]);

    // Atualiza contador
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    // Auto-save a cada 30s
    useEffect(() => {
        if (seconds > 0 && seconds - lastSaveRef.current >= 30) {
            saveToServer();
            lastSaveRef.current = seconds;
        }
    }, [seconds]);

    const saveToServer = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');
            await fetch('/api/reading-timer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    totalSeconds: seconds,
                    isTimerRunning: isRunning,
                }),
            });
        } catch (err) {
            console.error('Erro ao salvar timer:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePlayPause = async () => {
        const newState = !isRunning;
        setIsRunning(newState);

        try {
            const token = localStorage.getItem('token');
            await fetch('/api/reading-timer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    totalSeconds: seconds,
                    isTimerRunning: newState,
                }),
            });
        } catch (err) {
            console.error('Erro ao atualizar estado:', err);
        }
    };

    const handleStop = async () => {
        setIsRunning(false);
        await saveToServer();
        const totalMinutes = Math.floor(seconds / 60);
        onStop(totalMinutes);
    };

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-48' : 'w-80'
                }`}
        >
            <div
                className={`
                    rounded-xl shadow-2xl overflow-hidden
                    bg-gradient-to-br from-blue-500 to-indigo-600
                    text-white 
                    dark:from-slate-800 dark:to-slate-900 dark:text-gray-100
                    wood:from-amber-700 wood:to-amber-900 wood:text-amber-50
                    transition-all duration-500
                `}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between bg-black/20 dark:bg-white/10 wood:bg-black/30"
                    style={{ padding: '0.5rem 1rem' }}
                >
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">
                            {isMinimized ? 'Timer' : bookTitle}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {isSaving && (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />
                        )}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            {isMinimized ? (
                                <Maximize2 className="w-3 h-3" />
                            ) : (
                                <Minimize2 className="w-3 h-3" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Corpo */}
                {!isMinimized && (
                    <div style={{ padding: '1rem' }}>
                        {/* Display do tempo */}
                        <div style={{ marginBottom: '1rem' }} className="text-center">
                            <div className="text-4xl font-mono font-bold mb-1">
                                {formatTime(seconds)}
                            </div>
                            <div className="text-xs opacity-80">
                                {isRunning ? '🔴 Gravando' : '⏸️ Pausado'}
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div
                            className="grid grid-cols-2 gap-3 mb-4"
                            style={{ marginBottom: '1rem' }}
                        >
                            <div className="bg-white/10 rounded-lg text-center" style={{ padding: '0.5rem' }}>
                                <div className="text-xs opacity-80 mb-1">Minutos</div>
                                <div className="text-lg font-bold">{Math.floor(seconds / 60)}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg text-center" style={{ padding: '0.5rem' }}>
                                <div className="text-xs opacity-80 mb-1">Horas</div>
                                <div className="text-lg font-bold">
                                    {(seconds / 3600).toFixed(1)}
                                </div>
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-2">
                            <button
                                onClick={handlePlayPause}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${isRunning
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                style={{ padding: '0.5rem 0.75rem' }}
                            >
                                {isRunning ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                {isRunning ? 'Pausar' : 'Iniciar'}
                            </button>
                            <button
                                onClick={handleStop}
                                className="flex items-center justify-center gap-2 font-medium bg-red-500 hover:bg-red-600 transition-all rounded-lg"
                                style={{ padding: '0.5rem 0.75rem' }}
                            >
                                <Square className="w-4 h-4" />
                                Parar
                            </button>
                        </div>

                        {/* Mensagem motivacional */}
                        <div
                            className="text-center text-xs opacity-70 italic mt-3"
                            style={{ marginTop: '0.75rem' }}
                        >
                            &quot;Continue lendo! 📚&quot;
                        </div>
                    </div>
                )}

                {/* Versão Minimizada */}
                {isMinimized && (
                    <div
                        className="flex items-center justify-between"
                        style={{ padding: '0.75rem 1rem' }}
                    >
                        <div className="font-mono font-bold text-lg">{formatTime(seconds)}</div>
                        <button
                            onClick={handlePlayPause}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
