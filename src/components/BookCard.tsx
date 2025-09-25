'use client';
import { useState } from "react";
import { Book } from '@/types/types';
import BookCover from './BookCover';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import BookDetailsModal from './BookDetailsModal';
import BookEditModal from './BookEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';

type BookCardProps = {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onDetails: (book: Book) => void;
};

export default function BookCard({ book, onDelete }: BookCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => setShowEditModal(true);
  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = () => {
    if (onDelete) onDelete(book.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl/20 transition-all duration-200 hover:-translate-y-3">
        {/* Área da capa do livro */}
        <div className="relative">
          <BookCover cover={book.cover} title={book.title} />
          <StatusBadge status={book.status} />

          {/* Rating no canto superior direito */}
          <div className="absolute w-8 top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full shadow" style={{ padding: '0.3rem' }}>
            <svg
              width="16"
              height="14"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              className="drop-shadow-sm"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">{book.rating}</span>
          </div>
        </div>

        {/* Informações do livro */}
        <div style={{ padding: '1.5rem' }}>
          {/* Título */}
          <h3 className="font-bold text-gray-900 text-base leading-tight" style={{ marginBottom: '0.3rem' }}>
            {book.title}
          </h3>

          {/* Autor */}
          <p className="text-gray-600 text-xs" style={{ marginBottom: '0.4rem' }}>{book.author}</p>

          {/* Ano e Páginas */}
          <div className="flex items-center justify-between text-sm text-gray-400" style={{ marginBottom: '0.75rem' }}>
            <span>📅 {book.year}</span>
            <span>📄 250p</span>
          </div>

          {/* Gênero com fundo azul claro */}
          <div style={{ marginBottom: '1rem' }}>
            <span className="inline-block bg-blue-50 text-blue-600 text-sm rounded font-medium w-full text-center" style={{ padding: '0.25rem 0.5rem' }}>
              {book.genre}
            </span>
          </div>

          {/* Estrelas */}
          <div style={{ marginBottom: '1rem' }}>
            <StarRating rating={book.rating} />
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 bg-blue-50 text-blue-600 rounded-md text-sm cursor-pointer font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              style={{ padding: '0.5rem', height: '2rem' }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
              </svg>
              Detalhes
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 bg-gray-50 text-gray-600 rounded-lg text-sm cursor-pointer font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              style={{ padding: '0.5rem' }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3-6.5 6.5-.5 3 3-.5 6.5-6.5z" />
              </svg>
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-600 cursor-pointer rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center justify-center"
              style={{ padding: '0.5rem', width: '2rem', height: '2rem' }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <BookDetailsModal
        book={book}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={() => {
          setShowDetailsModal(false);
          setShowEditModal(true);
        }}
        onDelete={() => {
          setShowDetailsModal(false);
          setShowDeleteModal(true);
        }}
      />

      <BookEditModal
        book={book}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        bookTitle={book.title}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}