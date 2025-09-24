import { NextResponse } from 'next/server';
import { prisma } from "../../../../src/_lib/db";

//GET /api/books - listar todos
export async function GET() {
  const books = await prisma.books.findMany();
  return NextResponse.json(books);
}

//POST /api/books - adcionar
export async function POST(req: Request){
  const body = await req.json();
  const newBook = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      rating: body.rating,
      cover: body.cover || "",
      description: body.description,
    },
  });

  return NextResponse.json(newBook, {status: 201});
}
