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
    <div
      className="bg-orange-100 rounded-lg w-full"
      style={{ padding: "0.75rem", marginTop: "1rem" }}
      role="region"
      aria-label="Cronômetro de leitura"
    >
      {/* Header compacto */}
      <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
        <svg
          className="w-4 h-4 text-orange-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
        <h4 className="font-semibold text-orange-800 text-base">Cronômetro de Leitura</h4>
      </div>

      {/* Layout flexível: mobile e desktop */}
      <div
        className="bg-white rounded-lg shadow-sm border-2 border-orange-200 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ padding: "1rem" }}
      >
        {/* Timer */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-lg font-mono font-bold text-orange-800" style={{ marginBottom: "0.25rem" }}>
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-orange-600 font-medium" aria-live="polite">
            {isRunning ? "Ativo" : "Pausado"}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex justify-center sm:gap-6 gap-4 text-center items-center">
          <div>
            <p className="text-xs text-orange-700 font-medium" style={{ marginBottom: "0.25rem" }}>Sessão</p>
            <p className="text-lg font-bold text-orange-800">{Math.floor(seconds / 60)}min</p>
          </div>
          <div>
            <p className="text-xs text-orange-700 font-medium" style={{ marginBottom: "0.25rem" }}>Total</p>
            <p className="text-lg font-bold text-orange-800">
              {Math.floor(seconds / 3600)}h {Math.floor((seconds % 3600) / 60)}m
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            aria-label={isRunning ? "Pausar cronômetro" : "Iniciar cronômetro"}
            className={`flex items-center justify-center gap-1 rounded-md font-medium text-xs transition-all duration-200 cursor-pointer ${isRunning ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            style={{ padding: "0.5rem 0.75rem" }}
          >
            {isRunning ? "Pausar" : "Iniciar"}
          </button>

          <button
            onClick={() => {
              setSeconds(0);
              setIsRunning(false);
            }}
            aria-label="Resetar cronômetro"
            className="flex items-center justify-center gap-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium text-xs transition-all duration-200 cursor-pointer"
            style={{ padding: "0.5rem 0.75rem" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="text-center" style={{ marginTop: "0.5rem" }}>
        <p className="text-xs text-orange-600 italic">
          &quot;A leitura é uma conversa com as mentes mais nobres dos séculos passados.&quot;
        </p>
      </div>
    </div>
  );
}