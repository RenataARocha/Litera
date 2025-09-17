"use client";

import { useEffect, useState } from "react";
import { getBooks } from "@/lib/db";
import { Book } from "@/types/book";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Biblioteca</h1>
      <ul className="space-y-2">
        {books.map((book) => (
          <li key={book.id} className="border p-2 rounded">
            <strong>{book.titulo}</strong> — {book.autor} ({book.ano}) [{book.status}]
          </li>
        ))}
      </ul>
    </main>
  );
}
