'use client';
import Image from "next/image";
import { useState } from "react";
import { Book } from '@/types/types';

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
          <div className="flex gap-2 pt-3">
            <button 
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 bg-blue-50 text-blue-600 rounded-md h-8 text-sm font-medium hover:bg-blue-100 transition-colors px-3 py-2.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z"/>
              </svg>
              Detalhes
            </button>
            <button 
              onClick={handleEdit}
              className="flex-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors px-3 py-2.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3-6.5 6.5-.5 3 3-.5 6.5-6.5z"/>
              </svg>
              Editar
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-100 text-red-600 w-8 rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center justify-center px-3 py-2.5"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Livro</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {book.cover && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={150}
                    height={200}
                    className="rounded-lg shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>

                <div className="flex items-center gap-1">
                  {renderStars(book.rating)}
                  <span className="ml-2 text-sm text-gray-600">({book.rating}/5)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Ano:</span>
                    <p className="text-gray-600">{book.year}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Gênero:</span>
                    <p className="text-gray-600">{book.genre}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      {statusConfig.text}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Páginas:</span>
                    <p className="text-gray-600">250p</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Descrição:</span>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{book.description}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Editar Livro</h3>
              <p className="text-sm text-gray-600 mb-6">
                Deseja realmente editar &ldquo;{book.title}&rdquo;?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmEdit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excluir Livro</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tem certeza que deseja excluir "{book.title}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}