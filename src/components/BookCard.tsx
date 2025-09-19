'use client';

import { Star } from "lucide-react";
import Link from "next/link";
import Button from "./Button";
import Image from "next/image";

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  rating: number;
  cover?: string;
  description: string;
};

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="book-card bg-surface shadow-md rounded-2xl p-4 flex flex-col gap-3">
      <Image
        src={book.cover || "/fallback-cover.png"}
        alt={book.title}
        width={128}
        height={192}
        className="object-cover rounded-lg self-center shadow-lg"
      />
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-800">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-xs text-gray-400">{book.year} • {book.genre}</p>

        <div className="flex justify-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-all duration-200 ${
                i < book.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-5">
          {book.description}
        </p>
      </div>

      <div className="flex gap-2 mt-auto justify-center">
        <Button as={Link} href={`/books/${book.id}`} variant="primary" className="text-xs">
          Ver
        </Button>
        <Button as={Link} href={`/books/edit/${book.id}`} variant="ghost" className="text-xs">
          Editar
        </Button>
        <Button variant="danger" className="text-xs">
          Excluir
        </Button>
      </div>
    </div>
  );
}
