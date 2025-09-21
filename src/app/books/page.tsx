'use client';

import { useState, useEffect } from "react";
import BookCard from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { Grid, List } from 'lucide-react';

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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Consumo do JSON
  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data))
      .catch((err) => console.error("Erro ao carregar livro: ", err));
  }, []);

  // Lista de gêneros sem repetir valores
  const genres = Array.from(new Set(books.map((b) => b.genre)));

  // Filtrar
  const filtered = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre ? book.genre === genre : true;
    return matchesQuery && matchesGenre;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header da página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sua Biblioteca</h1>
        <p className="text-gray-600"
          style={{ marginBottom: '1.5rem' }}>Descubra, organize e acompanhe sua jornada literária</p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white rounded-2xl shadow-lg  p-6 mb-8" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Componentes de busca e filtro */}
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <GenreFilter genres={genres} value={genre} onChange={setGenre} />

          {/* Seletor de status */}
          <select className="w-45 h-12 text-left rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            style={{ padding: '0.5rem' }}>
            <option value="">📊 Todos os Status</option>
            <option value="QUERO_LER">🎯 Quero Ler</option>
            <option value="LENDO">📖 Lendo</option>
            <option value="LIDO">✅ Lido</option>
            <option value="PAUSADO">⏸️ Pausado</option>
            <option value="ABANDONADO">❌ Abandonado</option>
          </select>

          {/* Botões de visualização */}
          <div className=" w-12 h-12 gap-1 flex bg-width rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-blue-600 '
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Grid className="w-6 h-6" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-white text-blue-600 '
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Informações dos resultados */}
      <div style={{ marginBottom: '0.7rem' }}>
        <p className="text-gray-600">
          Mostrando {filtered.length} de {books.length} livros
        </p>
      </div>

      {/* Grid de livros */}
      {filtered.length > 0 ? (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
        }>
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum livro encontrado</h3>
          <p className="text-gray-600 mb-6">Tente ajustar os filtros ou adicionar novos livros à sua biblioteca.</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
            Adicionar Novo Livro
          </button>
        </div>
      )}
    </div>
  );
}