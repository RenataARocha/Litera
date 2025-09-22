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
    <div className="flex flex-col items-center mt-3 p-2 border-t border-gray-100">
      <div className="text-xs font-mono mb-1">{formatTime(seconds)}</div>
      <div className="flex gap-1">
        <button
          onClick={() => setIsRunning(true)}
          className="p-4 bg-green-500 text-white rounded text-xs"
        >
          ▶
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="px-4 py-1 bg-red-500 text-white rounded text-xs"
        >
          ⏸
        </button>
        <button
          onClick={() => setSeconds(0)}
          className="px-16 bg-gray-400 text-white rounded text-xs"
        >
          🔁
        </button>
      </div>
    </div>
  );
}
