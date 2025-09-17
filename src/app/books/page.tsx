'use client';

import { useState, useEffect } from "react";
import BookCard from "@/components/BookCard";
import { SearchBar} from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter"; 

type Book = {
    id: number;
    title: string;
    author: string;
    year: number;
    genre: string;
    rating: number;
    cover?: string;
    description: string;
};

export default function BooksPage(){
    const [books, setBooks] = useState<Book[]>([]);
    const [query, setQuery] = useState("");
    const [genre, setGenre] = useState("");

    //consumo do JSON
    useEffect(() => {
        fetch("/books.json")
        .then((res) => res.json())
        .then((data: Book[]) => setBooks(data))
        .catch((err) => console.error("Erro ao carregar livro: ", err));
    }, []);

    //lista de gêneros sem repetir valores
    const genres = Array.from(new Set(books.map((b) => b.genre)));

    //filtrar
    const filtered = books.filter((book) => {
        const matchesQuery =
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLocaleLowerCase());
        const matchesGenre = genre ? book.genre == genre : true;
        return matchesQuery && matchesGenre;
    });

      return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Biblioteca</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <GenreFilter genres={genres} value={genre} onChange={setGenre} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhum livro encontrado.</p>
      )}
    </div>
  );
}