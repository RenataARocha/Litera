import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/db';
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client';


const mapStatusToDB = (status: string): BookStatus => {
  switch (status.toLowerCase()) {
    case 'lido':
      return BookStatus.READ;
    case 'lendo':
      return BookStatus.READING;
    case 'quero ler':
    case 'não lido':
      return BookStatus.TO_READ; 
    case 'pausado':
      return BookStatus.PAUSED;
    case 'abandonado':
    return BookStatus.ABANDONED;
    default:
      return BookStatus.TO_READ;
  }
};

const mapRatingToDB = (rating: number): BookRating| null => {
  switch (rating) {
    case 5:
      return BookRating.FIVE_STARS;
    case 4:
      return BookRating.FOUR_STARS;
    case 3:
      return BookRating.THREE_STARS;
    case 2:
      return BookRating.TWO_STARS;
    case 1:
      return BookRating.ONE_STAR;
    case 0:
    default: return null; 
  }
};

const mapStatusToFrontend = (dbStatus: BookStatus): string => {
  switch (dbStatus) {
    case BookStatus.READ:
      return 'Lido';
    case BookStatus.READING:
      return 'Lendo';
    case BookStatus.TO_READ:
      return 'Quero Ler';
    case BookStatus.PAUSED:
      return 'Pausado';
    case BookStatus.ABANDONED:
      return 'Abandonado'; 
      return 'Não Lido';
  }
};

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },

      orderBy: {
        title: 'asc', 
      },
    });

    const formattedBooks = books.map(book => ({
      ...book,
      author: book.author ? book.author.name : 'Autor Desconhecido', 
      status: mapStatusToFrontend(book.status),
      rating: book.rating ? book.rating.length : 0, 
    }));

    return NextResponse.json(formattedBooks, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor ao buscar os livros.' },
      { status: 500 }
    );
  }
}

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