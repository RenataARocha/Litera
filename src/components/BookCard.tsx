'use client';
import Image from "next/image";
import { Book } from '@/types/types';
import Timer from './TimerBook';

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Área da capa do livro */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            width={200}
            height={200}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-12 h-12 flex items-center justify-center mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
              </svg>
            </div>
            <span className="text-xs text-center">Sem capa</span>
          </div>
        )}

        {/* Status no canto superior esquerdo */}
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full shadow">
          {book.status === "read"
            ? "Lido"
            : book.status === "reading"
              ? "Lendo"
              : book.status === "paused"
                ? "Pausado"
                : book.status === "to-read"
                  ? "Quero ler"
                  : "Abandonado"}
        </span>

        {/* Favorito e estrelas no canto superior direito */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="red"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
              5.42 4.42 3 7.5 3c1.74 0 3.41.81 
              4.5 2.09C13.09 3.81 14.76 3 
              16.5 3 19.58 3 22 5.42 22 
              8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"/>
          </svg>
          <span className="text-xs text-gray-600">{book.rating}</span>
        </div>
      </div>

      {/* Informações do livro */}
      <div style={{ padding: '16px' }}>
        {/* Título */}
        <div style={{ marginBottom: '8px' }}>
          <h3
            className="font-semibold text-gray-900 text-sm leading-tight"
            style={{ marginBottom: '4px' }}
          >
            {book.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{book.year}</span>
            <span>•</span>
            <span>{book.genre}</span>
          </div>
        </div>

        {/* Autor */}
        <p className="text-gray-600 text-xs mb-2">{book.author}</p>

        {/* Descrição */}
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {book.description}
        </p>

        {/* Botões */}
        <div className="flex gap-2 border-t border-gray-100 pt-3">
          <button className="flex-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors px-3 py-2">
            Editar
          </button>
          <button className="bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center px-3 py-2">
            👁
          </button>
          <button className="bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors flex items-center justify-center px-3 py-2">
            🗑
          </button>
          <Timer bookId={book.id} />
        </div>
      </div>
    </div>
  );
}
