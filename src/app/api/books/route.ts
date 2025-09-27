import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/db';
import { BookStatus, BookRating } from '@prisma/client';


const mapStatusToDB = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'lido':
      return BookStatus.READ;
    case 'lendo':
      return BookStatus.READING;
    case 'quero ler':
      return BookStatus.TO_READ; 
    case 'pausado':
    case 'não lido': 
    default:
      return BookStatus.TO_READ; 
  }
};

const mapRatingToDB = (rating: number): BookRating| null => {
  switch (rating) {
    case 5:
      return 'FIVE_STARS';
    case 4:
      return 'FOUR_STARS';
    case 3:
      return 'THREE_STARS';
    case 2:
      return 'TWO_STARS';
    case 1:
      return 'ONE_STAR';
    case 0:
    default: return null; 
  }
};

export async function POST(request: Request) {
  try {
    const bookData = await request.json();

    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { message: 'Título e Autor são obrigatórios.' },
        { status: 400 }
      );
    }
    
    const dbStatus = mapStatusToDB(bookData.status);
    const dbRating = mapRatingToDB(bookData.rating);

    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        year: bookData.year ?? null,
        pages: bookData.pages,
        genre: bookData.genre ?? null,
        cover: bookData.cover,
        isbn: bookData.isbn,
        description: bookData.description ?? '',
        notes: bookData.notes ?? null,
        status: dbStatus as any, 
        rating: dbRating as any,
        author: {
          connectOrCreate: {
            where: { name: bookData.author }, 
            create: { name: bookData.author }, 
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Livro adicionado com sucesso!', book: newBook },
      { status: 201 } 
    );

  } catch (error) {
    console.error('Erro ao salvar livro:', error);
    
    return NextResponse.json(
      { message: 'Erro interno do servidor ao adicionar o livro. Verifique a conexão com o banco de dados.' },
      { status: 500 }
    );
  }
}