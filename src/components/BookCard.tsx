'use client';

import { Star } from "lucide-react";

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

type Props = {
    book: Book;
};

export default function BookCard({ book }: Props){
    return(
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3">
      {/* capa */}
      <img
        src={book.cover || "/fallback-cover.png"}
        alt={book.title}
        className="w-32 h-48 object-cover rounded-lg self-center"
      />

      {/* informações principais */}
      <div className="text-center">
        <h3 className="font-bold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-xs text-gray-400">
          {book.year} • {book.genre}
        </p>

        {/* estrelas */}
        <div className="flex justify-center mt-1">
          {Array.from({ length: book.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>

        {/* descrição (limitada em 5 linhas) */}
        <p className="text-sm text-gray-700 mt-2 line-clamp-5">
          {book.description}
        </p>
      </div>

      {/* botões de ação */}
      <div className="flex gap-2 mt-auto justify-center">
        <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md">
          Ver
        </button>
        <button className="px-2 py-1 text-xs bg-green-500 text-white rounded-md">
          Editar
        </button>
        <button className="px-2 py-1 text-xs bg-red-500 text-white rounded-md">
          Excluir
        </button>
      </div>
    </div>
    )
}
