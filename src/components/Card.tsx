'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BookCard from './BookCard';
import { Book } from '@/types/types';

type BooksGridProps = {
  books: Book[];
  onDelete?: (bookId: number) => void;
};

export default function BooksGrid({ books, onDelete }: BooksGridProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0); // reset ao trocar de aba

    if (!books || books.length === 0) return;

    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= books.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 80); // 80ms entre cada card

    return () => clearInterval(timer);
  }, [books]);

  const visibleBooks = books.slice(0, visibleCount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {visibleBooks.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: 'spring', stiffness: 100, damping: 15 } }}
            exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
            className="w-full" // 💡 SOLUÇÃO: Garante que o item ocupe 100% da coluna.
          >
            <BookCard
              book={book}
              onDelete={onDelete}
              onDetails={(book) => console.log('Ver detalhes:', book)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
