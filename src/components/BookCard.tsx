'use client';
import Image from "next/image";
import { useState } from "react";
import { Book } from '@/types/types';
import Timer from './TimerBook';

type BookCardProps = {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
};

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para obter as cores e texto de cada status
  const getStatusConfig = (status: string) => {
    const configs = {
      read: {
        text: "Lido",
        bgColor: "bg-green-100",
        textColor: "text-green-700",      },
      reading: {
        text: "Lendo",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",     },
      paused: {
        text: "Pausado",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      },
      "to-read": {
        text: "Quero Ler",
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
      },
      abandoned: {
        text: "Abandonado",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      }
    };
    
    return configs[status as keyof typeof configs] || configs.abandoned;
  };

  const statusConfig = getStatusConfig(book.status);

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={index < rating ? "#fbbf24" : "#e5e7eb"}
        className="drop-shadow-sm"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ));
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmEdit = () => {
    if (onEdit) onEdit(book);
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (onDelete) onDelete(book.id);
    setShowDeleteModal(false);
  };

  return (
    <>
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

          {/* Status no canto superior esquerdo sem borda */}
          <span className={`absolute top-2 left-2 ${statusConfig.bgColor} ${statusConfig.textColor} text-[10px] px-6 py-1 rounded-full shadow-sm font-medium`}>
            {statusConfig.text}
          </span>

          {/* Rating com estrela no canto superior direito */}
          <div className="absolute w-8 top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow">
            <svg
              width="16"
              height="14"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              className="drop-shadow-sm"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xs text-gray-700 font-medium">{book.rating}</span>
          </div>
        </div>

        {/* Informações do livro */}
        <div  style={{ padding: '2rem', lineHeight: '3rem' }}>
         
          {/* Título */}
          <h3 className="font-bold text-gray-900 text-base leading-tight" style={{ marginBottom: '0.3rem'}}>
            {book.title}
          </h3>

          {/* Autor */}
          <p className="text-gray-600 text-xs" style={{ marginBottom: '0.4rem'}}>{book.author}</p>

          {/* Ano e Páginas */}
          <div className="flex items-center gap-32 text-sm text-gray-400 mb-3">
            <span>📅 {book.year}</span>
            <span>📄 250p</span> 
          </div>

          {/* Gênero com fundo azul claro */}
          <div className="mb-4">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm px-2 py-1 w-full text-center rounded font-medium">
              {book.genre}
            </span>
          </div>

          {/* Estrelas */}
          <div className="flex items-center gap-1" style={{marginBottom: '0.5rem'}}>
            {renderStars(book.rating)}
          </div>

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
        </div>
      </div>
    </div>
  );
}