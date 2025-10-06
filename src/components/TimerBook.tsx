'use client';
import { useState, useEffect } from "react";

interface TimerProps {
  bookId: number;
}

export default function Timer({ bookId }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Carregar tempo salvo
  useEffect(() => {
    const saved = localStorage.getItem(`book-timer-${bookId}`);
    if (saved) setSeconds(Number(saved));
  }, [bookId]);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem(`book-timer-${bookId}`, String(seconds));
  }, [seconds, bookId]);

  // Atualização do timer
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-orange-100 rounded-lg w-full wood:bg-yellow-200" style={{ padding: '0.75rem', marginTop: '1rem' }}>
      {/* Header compacto */}
      <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
        <svg className="w-4 h-4 text-orange-600 wood:text-primary-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
        <h4 className="font-semibold text-orange-800 text-base wood:text-primary-900">Cronômetro de Leitura</h4>
      </div>

      {/* Layout horizontal: Timer + Estatísticas + Botões */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-orange-200 w-full flex items-center justify-between wood:bg-yellow-50 wood:border-yellow-300" style={{ padding: '1rem' }}>
        {/* Timer à esquerda */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-lg font-mono font-bold text-orange-800 wood:text-primary-900" style={{ marginBottom: '0.25rem' }}>
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-orange-600 font-medium wood:text-primary-900">
            {isRunning ? "Ativo" : "Pausado"}
          </p>
        </div>

        {/* Estatísticas no centro */}
        <div className="flex gap-4 text-center items-center">
          <div>
            <p className="text-xs text-orange-700 font-medium wood:text-primary-900" style={{ marginBottom: '0.25rem' }}>
              Sessão
            </p>
            <p className="text-lg font-bold text-orange-800 wood:text-primary-900">
              {Math.floor(seconds / 60)}min
            </p>
          </div>
          <div>
            <p className="text-xs text-orange-700 font-medium wood:text-primary-900" style={{ marginBottom: '0.25rem' }}>
              Total
            </p>
            <p className="text-lg font-bold text-orange-800 wood:text-primary-900">
              {Math.floor(seconds / 3600)}h {Math.floor((seconds % 3600) / 60)}m
            </p>
          </div>
        </div>

        {/* Botões à direita */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-all duration-200 cursor-pointer
              ${isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white wood:bg-red-300 wood:hover:bg-red-400 wood:text-primary-900'
                : 'bg-green-500 hover:bg-green-600 text-white wood:bg-green-300 wood:hover:bg-green-400 wood:text-primary-900'
              }`}
            style={{ padding: '0.5rem 0.75rem' }}
          >
            {isRunning ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Iniciar
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSeconds(0);
              setIsRunning(false);
            }}
            className="flex items-center justify-center gap-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium text-xs transition-all duration-200 cursor-pointer wood:bg-gray-300 wood:hover:bg-gray-400 wood:text-primary-900"
            style={{ padding: '0.5rem 0.75rem' }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Frase motivacional compacta */}
      <div className="text-center" style={{ marginTop: '0.5rem' }}>
        <p className="text-xs text-orange-600 italic wood:text-primary-900">
          &quot;A leitura é uma conversa com as mentes mais nobres dos séculos passados.&quot;
        </p>
      </div>
    </div>
  );
}
