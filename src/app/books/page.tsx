'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { Book } from '@/components/types/types';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

// Consumo da API Route
useEffect(() => {
  const fetchBooks = async () => {
    try {
      // Mude para o caminho da sua API Route
      const res = await fetch("/api/books"); 

      if (!res.ok) {
        throw new Error("Falha ao buscar livros da API");
      }

      const data: Book[] = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Erro ao carregar livros: ", err);
    }
  };

  fetchBooks();
}, []);

  //Mapeia todos os gêneros
    const allGenresWithNull = books.map((b) => b.genre);

  //Removendo todos os valores null
    const validGenres = allGenresWithNull.filter((g): g is string => g !== null);

  //Cria o Set para ter apenas valores únicos
    const genres = Array.from(new Set(validGenres));

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

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setQuery("");
    setGenre("");
    setStatusFilter("");
  };

  // Handlers
  const handleEdit = (book: Book) => {
    router.push(`/books/edit/${book.id}`);
  };

// app/books/page.tsx (dentro da função BooksPage)

// Handlers
// ... (handleEdit, handleDetails)

const handleDelete = async (bookId: number) => {
    if (!window.confirm("Tem certeza que deseja remover este livro da sua biblioteca?")) {
        return;
    }

    try {
        const res = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error("Falha ao excluir o livro no servidor.");
        }
        setBooks(books.filter(book => book.id !== bookId));
        alert('Livro removido com sucesso!');
        
    } catch (error) {
        console.error("Erro ao excluir livro:", error);
        alert('Erro ao excluir livro. Tente novamente.');
    }
};

  const handleDetails = (book: Book) => {
    router.push(`/books/${book.id}`);
  };

  const hasActiveFilters = query || genre || statusFilter;

  return (
    <div style={{ padding: '2rem' }}>
      {/* Botão Voltar para Home */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 cursor-pointer rounded-lg hover:underline transition-colors"
          style={{ padding: '1rem 1rem' }}
        >
          ← Voltar para Home
        </button>
      </div>

      {/* Header da página */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-400" style={{ marginBottom: '0.5rem' }}>
          Sua Biblioteca
        </h1>
        <p className="text-gray-600 dark:text-blue-200" style={{ marginBottom: '1.5rem' }}>
          Descubra, organize e acompanhe sua jornada literária
        </p>
      </div>

      {/* Componente de filtros unificado */}
      <FilterBar
        query={query}
        genre={genre}
        status={statusFilter}
        genres={genres}
        onQueryChange={setQuery}
        onGenreChange={setGenre}
        onStatusChange={setStatusFilter}
        onClearFilters={clearAllFilters}
      />

      {/* Informações dos resultados */}
      <div style={{ marginBottom: '0.9rem', marginTop: '1rem' }}>
        <p className="text-gray-600 dark:text-blue-400">
          Mostrando {filtered.length} de {books.length} livros
          {hasActiveFilters && (
            <span className="text-sm text-blue-600" style={{ marginLeft: '0.5rem' }}>
              (filtros ativos)
            </span>
          )}
        </p>
      </div>

      {/* Exibição dos livros centralizados */}
      {filtered.length > 0 ? (
        <div className="flex justify-center">
          <div className="max-w-6xl w-full">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center"
              style={{ gap: '1.5rem' }}
            >
              {filtered.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDetails={handleDetails}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 rounded-2xl 
          shadow-md dark:bg-gray-800 dark:border-[#3b82f6] dark:border"
          style={{ padding: "2rem", margin: "2rem auto", maxWidth: "500px" }}
        >
          <div className="text-6xl animate-bounce" style={{ marginBottom: '1rem' }}>📚</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-blue-400" style={{ marginBottom: '0.5rem' }}>
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-600 dark:text-blue-200" style={{ marginBottom: '1.5rem' }}>
            Tente ajustar os filtros ou adicionar novos livros à sua biblioteca.
          </p>
          <button
            onClick={() => router.push('/books/new')}
            className="bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem" }}
          >
            Adicionar Novo Livro
          </button>
        </div>
      )}
    </div>
  );
}