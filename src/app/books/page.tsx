'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { Book } from '@/components/types/types';
import { livrosExposicao } from '@/app/utils/dadosExposicao';
export const dynamic = 'force-dynamic';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Verificar login
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Converter livros de exposição para o formato Book
  const livrosExposicaoFormatados: Book[] = livrosExposicao.map((livro, index) => ({
    id: index + 1000,
    title: livro.title,
    author: livro.author,
    cover: livro.cover,
    status: livro.status,
    rating: livro.rating,
    year: 2024,
    genre: livro.genre,
    description: "Este é um livro de exemplo para demonstração.",
    pages: livro.totalPages,
    finishedPages: livro.pagesRead,
    lastRead: livro.lastRead,
    notes: "",
    isbn: "",
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));

  // 🔥 EXTRAIR fetchBooks para poder reusar
  const fetchBooks = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setIsRefreshing(true);

      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token não encontrado');
        setLoading(false);
        return;
      }

      const res = await fetch("/api/books", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar livros da API");
      }

      const data: Book[] = await res.json();
      console.log('📚 Livros carregados:', data.length);
      setBooks(data);
    } catch (err) {
      console.error("Erro ao carregar livros: ", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Buscar livros da API (apenas se logado)
  useEffect(() => {
    fetchBooks();
  }, [isLoggedIn]);

  // 🔥 NOVO: Escutar atualizações de livros de outras páginas
  useEffect(() => {
    const handleBookUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('📚 Livro atualizado:', customEvent.detail);
      fetchBooks(); // Recarrega a lista
    };

    window.addEventListener('bookUpdated', handleBookUpdated);

    return () => {
      window.removeEventListener('bookUpdated', handleBookUpdated);
    };
  }, [isLoggedIn]);

  // Decidir quais livros mostrar
  const livrosParaMostrar = isLoggedIn ? books : livrosExposicaoFormatados;

  // Mapeia todos os gêneros
  const allGenresWithNull = livrosParaMostrar.map((b) => b.genre);
  const validGenres = allGenresWithNull.filter((g): g is string => g !== null);
  const genres = Array.from(new Set(validGenres));

  // Filtrar
  const filtered = livrosParaMostrar.filter((book) => {
    const queryLower = query.toLowerCase();

    const matchesQuery =
      book.title.toLowerCase().includes(queryLower) ||
      book.author.toLowerCase().includes(queryLower) ||
      (book.genre && book.genre.toLowerCase().includes(queryLower));

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

  // FUNÇÃO PARA ATUALIZAR UM LIVRO NA LISTA
  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
  };

  // Handlers
  const handleEdit = (book: Book) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/books');
      localStorage.setItem('loginMessage', 'Faça login para editar livros');
      router.push('/login');
      return;
    }
    router.push(`/books/edit/${book.id}`);
  };

  const handleDelete = async (bookId: number) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/books');
      localStorage.setItem('loginMessage', 'Faça login para gerenciar seus livros');
      router.push('/login');
      return;
    }

    if (!window.confirm("Tem certeza que deseja remover este livro da sua biblioteca?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/books');
      localStorage.setItem('loginMessage', 'Faça login para ver os detalhes completos');
      router.push('/login');
      return;
    }
    router.push(`/books/${book.id}`);
  };

  const handleAddBook = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/books/new');
      localStorage.setItem('loginMessage', 'Faça login para adicionar novos livros');
      router.push('/login');
    } else {
      router.push('/books/new');
    }
  };

  const hasActiveFilters = query || genre || statusFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen wood:bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 wood:border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="wood:bg-background wood:min-h-screen" style={{ padding: '2rem' }}>
      {/* 🔥 NOVO: Indicador de atualização */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Atualizando...</span>
        </div>
      )}

      {/* Header da página */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-blue-400 wood:text-primary-200" style={{ marginBottom: '0.5rem' }}>
          Sua Biblioteca
        </h1>
        <p className="text-gray-600 dark:text-blue-200 wood:text-secondary-200" style={{ marginBottom: '1.5rem' }}>
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
      <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <p className="text-gray-600 dark:text-blue-400 wood:text-secondary-200">
          Mostrando {filtered.length} de {livrosParaMostrar.length} livros
          {hasActiveFilters && (
            <span className="text-sm text-blue-600 wood:text-accent-400" style={{ marginLeft: '0.5rem' }}>
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
                  onUpdate={handleUpdateBook}
                  isExposicao={!isLoggedIn}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="text-center"
          style={{ padding: "2rem", margin: "2rem auto", maxWidth: "500px" }}
        >
          <div className="text-6xl animate-bounce" style={{ marginBottom: '1rem' }}>📚</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-blue-400 wood:text-accent-500" style={{ marginBottom: '0.5rem' }}>
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-600 dark:text-blue-200 wood:text-accent-600" style={{ marginBottom: '1.5rem' }}>
            Tente ajustar os filtros ou adicionar novos livros à sua biblioteca.
          </p>
          <button
            onClick={handleAddBook}
            className="bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-md cursor-pointer
            dark:bg-blue-200/20 dark:hover:bg-blue-200/30 dark:text-blue-200
            wood:bg-[var(--color-primary-900)] wood:hover:bg-primary-800 wood:text-primary-200"
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem" }}
          >
            Adicionar Novo Livro
          </button>
        </div>
      )}
    </div>
  );
}