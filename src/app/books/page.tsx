'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import BookCard from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { Grid, List } from 'lucide-react';
import { Book } from '@/types/types';

export default function BooksPage() {
  const router = useRouter(); // <- importante
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Consumo do JSON
  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data))
      .catch((err) => console.error("Erro ao carregar livros: ", err));
  }, []);

  // Lista de gêneros sem repetir valores
  const genres = Array.from(new Set(books.map((b) => b.genre)));

  // Filtrar
  const filtered = books.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());

    const matchesGenre = genre ? book.genre === genre : true;

    const matchesStatus = statusFilter
      ? book.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return matchesQuery && matchesGenre && matchesStatus;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* Botão Voltar para Home */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-blue-600 cursor-pointer rounded-lg hover:underline transition-colors"
        >
          ← Voltar para Home
        </button>
      </div>

      {/* Header da página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sua Biblioteca</h1>
        <p className="text-gray-600" style={{ marginBottom: '1.5rem' }}>
          Descubra, organize e acompanhe sua jornada literária
        </p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Busca */}
          <div className="flex-1">
            <SearchBar
              value={query}
              genre={genre}
              status={statusFilter}
              onChange={setQuery}
            />
          </div>

          {/* Filtro por gênero */}
          <GenreFilter genres={genres} value={genre} onChange={setGenre} />

          {/* Filtro por status */}
          <select
            className="w-45 h-12 text-left cursor-pointer rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            style={{ padding: '0.5rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">📊 Todos os Status</option>
            <option value="quero ler">🎯 Quero Ler</option>
            <option value="lendo">📖 Lendo</option>
            <option value="lido">✅ Lido</option>
            <option value="pausado">⏸️ Pausado</option>
            <option value="abandonado">❌ Abandonado</option>
          </select>

          {/* Botões de visualização */}
          <div className="w-18 h-18 gap-1 flex rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'grid'
                ? 'bg-white text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Grid className="w-6 h-6" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'list'
                ? 'bg-white text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Informações dos resultados */}
      <div style={{ marginBottom: '0.9rem', marginTop: '1rem' }}>
        <p className="text-gray-600">
          Mostrando {filtered.length} de {books.length} livros
        </p>
      </div>

      {/* Grid de livros */}
      {filtered.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar os filtros ou adicionar novos livros à sua biblioteca.
          </p>
          <button
            onClick={() => router.push('/new-book')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Adicionar Novo Livro
          </button>
        </div>
      )}
    </div>
  );
}
