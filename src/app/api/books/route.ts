import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Caminho para o JSON
const filePath = path.join(process.cwd(), 'public', 'books.json');

function readBooks() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
}

function saveBooks(books: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

// GET → lista todos os livros
export async function GET() {
  const books = readBooks();
  return NextResponse.json(books);
}

// POST → adiciona novo livro
export async function POST(req: Request) {
  const body = await req.json();
  const books = readBooks();

  const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;

  const newBook = {
    id: newId,
    title: body.title,
    author: body.author,
    year: body.year,
    genre: body.genre,
    rating: body.rating,
    cover: body.cover || "",
    description: body.description,
  };

  books.push(newBook);
  saveBooks(books);

  return NextResponse.json(newBook, { status: 201 });
}
