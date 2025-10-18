"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/components/types/types";
import BookCover from "./BookCover";
import StatusBadge from "./StatusBadge";
import StarRating from "./StarRating";
import BookDetailsModal from "./BookDetailsModal";
import BookEditModal from "./BookEditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { AnimatePresence, motion, Variants } from "framer-motion";

type BookCardProps = {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onUpdate?: (updatedBook: Book) => void;
  onDetails: (book: Book) => void;
  isExposicao?: boolean;
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ease: [0.17, 0.67, 0.83, 0.67],
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function BookCard({
  book,
  onDelete,
  onUpdate,
  isExposicao = false,
}: BookCardProps) {
  const router = useRouter();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  //  Sincroniza quando a prop book mudar
  useEffect(() => {
    setCurrentBook(book);
  }, [book]);

  const handleProtectedAction = (action: "details" | "edit" | "delete") => {
    if (isExposicao || !isLoggedIn) {
      const messages = {
        details: "Faça login para ver os detalhes completos do livro",
        edit: "Faça login para editar este livro",
        delete: "Faça login para gerenciar seus livros",
      };
      localStorage.setItem("redirectAfterLogin", "/books");
      localStorage.setItem("loginMessage", messages[action]);
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleRatingChange = (newRating: number) => {
    const updatedBook = { ...currentBook, rating: newRating };
    setCurrentBook(updatedBook);
    if (onUpdate) onUpdate(updatedBook);
  };


  const handleDetails = () => {
    if (handleProtectedAction("details")) {
      setShowDetailsModal(true);
    }
  };

  const handleEdit = () => {
    if (handleProtectedAction("edit")) {
      setShowEditModal(true);
    }
  };

  const handleDelete = () => {
    if (handleProtectedAction("delete")) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (onDelete) onDelete(currentBook.id);
    setShowDeleteModal(false);
  };

  //  Função para salvar edições
  const handleSaveEdit = (updatedBook: Book) => {
    setCurrentBook(updatedBook);
    if (onUpdate) onUpdate(updatedBook);
  };

  return (
    <>
      {/* Card */}
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{
          scale: 1.05,
          y: -10,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        className="
  group bg-white wood:bg-[var(--color-primary-900)] rounded-lg shadow-sm border border-gray-200 
  wood:border-transparent overflow-hidden cursor-pointer transition-shadow duration-300 w-full min-w-0
  dark:border-transparent dark:bg-blue-200/10 dark:group-hover:bg-blue-200/10 dark:hover:border-[#3b82f6]
  wood:group-hover:bg-[var(--color-background)] wood:hover:!shadow-[0_6px_20px_rgba(251,121,36,0.6)]
"
      >
        {/* Área da capa do livro */}
        <div className="relative bg-gray-200 dark:bg-gray-800 p-1 wood:bg-[var(--color-secondary-800)]">
          <BookCover cover={currentBook.cover} title={currentBook.title} />
          <StatusBadge status={currentBook.status} />

          {/* Rating */}
          <div
            className="absolute w-8 top-2 right-2 flex items-center gap-1 bg-white/90 wood:bg-[var(--color-primary-50)] backdrop-blur-sm rounded-full shadow"
            style={{ padding: "0.3rem" }}
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              className="drop-shadow-sm"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs text-gray-700 dark:text-blue-600 wood:text-[var(--color-primary-800)] font-medium">
              {currentBook.rating}
            </span>
          </div>
        </div>

        {/* Informações do livro */}
        <div style={{ padding: "1.5rem" }}>
          <h3
            className="font-bold text-gray-900 text-base leading-tight overflow-hidden text-ellipsis 
      dark:text-blue-400 line-clamp-2 min-w-0 wood:text-[var(--color-accent-500)]"
            style={{ marginBottom: "0.3rem" }}
          >
            {currentBook.title}
          </h3>
          <p
            className="text-gray-600 text-xs dark:text-blue-200 wood:text-[var(--color-primary-200)]"
            style={{ marginBottom: "0.4rem" }}
          >
            {currentBook.author}
          </p>

          <div
            className="flex items-center justify-between text-sm text-gray-400 dark:text-blue-200 wood:text-[var(--color-primary-100)]"
            style={{ marginBottom: "0.75rem" }}
          >
            <span>📅 {currentBook.year}</span>
            <span>📄 {currentBook.pages}</span>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <span
              className="inline-block bg-blue-50 text-blue-600 text-sm rounded font-medium w-full text-center
        dark:bg-blue-200/10 dark:text-blue-200 wood:bg-[var(--color-primary-700)] wood:text-[var(--color-primary-200)]"
              style={{ padding: "0.25rem 0.5rem" }}
            >
              {currentBook.genre}
            </span>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <StarRating rating={currentBook.rating}
              onChange={handleRatingChange} />
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleDetails}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
          flex-1 bg-blue-50 text-blue-600 rounded-md text-sm cursor-pointer font-medium 
          hover:bg-blue-100 transition-colors flex items-center justify-center gap-2
          dark:bg-blue-200/10 dark:hover:bg-blue-200/20 dark:text-blue-200
          wood:bg-[var(--color-primary-700)] wood:hover:bg-[var(--color-primary-600)] wood:text-[var(--color-primary-200)]
        "
              style={{ padding: "0.5rem" }}
              title={
                isExposicao ? "Faça login para ver detalhes" : "Ver detalhes"
              }
            >
              Detalhes
            </motion.button>

            <motion.button
              onClick={handleEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
          flex-1 bg-gray-50 text-gray-600 rounded-lg text-sm cursor-pointer font-medium 
          hover:bg-gray-100 transition-colors flex items-center justify-center gap-2
          dark:bg-blue-200/10 dark:hover:bg-blue-200/20 dark:text-blue-200
          wood:bg-[var(--color-secondary-700)] wood:hover:bg-[var(--color-secondary-600)] wood:text-[var(--color-primary-200)]
        "
              style={{ padding: "0.5rem" }}
              title={isExposicao ? "Faça login para editar" : "Editar livro"}
            >
              Editar
            </motion.button>

            <motion.button
              aria-label="Excluir livro"
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className=" bg-red-100 text-red-600 cursor-pointer rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center justify-center
               dark:bg-red-200/10 dark:hover:bg-red-200/30 dark:border-transparent dark:hover:border-red-400 dark:text-red-200
                wood:bg-red-800/20 wood:hover:bg-red-800/30 wood:text-[var(--color-accent-500)] "
              style={{ padding: "0.4rem", width: "2rem", height: "2rem" }}
              title={
                isExposicao ? "Faça login para gerenciar" : "Excluir livro"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modais - Só aparecem se NÃO for livro de exposição */}
      {!isExposicao && (
        <>
          <AnimatePresence>
            {showDetailsModal && (
              <motion.div
                key="detailsModal"
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <motion.div
                  className="absolute inset-0 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <BookDetailsModal
                    book={currentBook}
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
                    onUpdate={handleSaveEdit}
                  />

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showEditModal && (
              <motion.div
                key="editModal"
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <motion.div
                  className="absolute inset-0 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <BookEditModal
                    book={currentBook}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEdit}
                    onBack={() => {
                      setShowEditModal(false);
                      setShowDetailsModal(true);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                key="deleteModal"
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <motion.div
                  className="absolute inset-0 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    bookTitle={currentBook.title}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}