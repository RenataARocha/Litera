// src/lib/db.ts
import { Book } from "@/types/book";

const STORAGE_KEY = "books_db";

// livros iniciais (seed)
const seedBooks: Book[] = [
  { id: "1", titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, genero: "Romance", status: "lido" },
  { id: "2", titulo: "O Hobbit", autor: "J.R.R. Tolkien", ano: 1937, genero: "Fantasia", status: "lendo" },
  { id: "3", titulo: "1984", autor: "George Orwell", ano: 1949, genero: "Ficção", status: "quero ler" },
  { id: "4", titulo: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, genero: "Drama", status: "lido" },
  { id: "5", titulo: "Clean Code", autor: "Robert C. Martin", ano: 2008, genero: "Tecnologia", status: "quero ler" },
];

// 🔹 inicializa o "banco" no primeiro acesso
function initDB() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBooks));
    }
  }
}

// 🔹 pega todos os livros
export function getBooks(): Book[] {
  initDB();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 🔹 adiciona livro
export function addBook(book: Book) {
  const books = getBooks();
  books.push(book);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// 🔹 atualiza livro
export function updateBook(updated: Book) {
  let books = getBooks();
  books = books.map((b) => (b.id === updated.id ? updated : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// 🔹 deleta livro
export function deleteBook(id: string) {
  let books = getBooks();
  books = books.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
