// src/types/book.ts
export type BookStatus = "lido" | "lendo" | "quero ler";

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
  status: BookStatus;
}
