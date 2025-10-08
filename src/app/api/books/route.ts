import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/db';
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client';

// Mapeia status do frontend para o banco
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

// Mapeia rating numérico para enum do banco
const mapRatingToDB = (rating: number): BookRating | null => {
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
    default:
      return null;
  }
};

// Mapeia enum do banco para string amigável
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
    default:
      return 'Não Lido';
  }
};

// Mapeia enum do banco para número
const mapRatingToFrontend = (rating: BookRating | null): number => {
  if (!rating) return 0;

  switch (rating) {
    case BookRating.FIVE_STARS:
      return 5;
    case BookRating.FOUR_STARS:
      return 4;
    case BookRating.THREE_STARS:
      return 3;
    case BookRating.TWO_STARS:
      return 2;
    case BookRating.ONE_STAR:
      return 1;
    default:
      return 0;
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

    const formattedBooks = books.map((book) => ({
      ...book,
      author: book.author ? book.author.name : 'Autor Desconhecido',
      status: mapStatusToFrontend(book.status),
      rating: mapRatingToFrontend(book.rating),
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

    // Validação básica
    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { message: 'Título e Autor são obrigatórios.' },
        { status: 400 }
      );
    }

    // Converte status e rating para os enums do banco
    const dbStatus = mapStatusToDB(bookData.status || 'Quero Ler');
    const dbRating = mapRatingToDB(bookData.rating || 0);

    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        year: bookData.year ?? null,
        pages: bookData.pages ?? 0,
        finishedPages: bookData.finishedPages ?? 0,
        genre: bookData.genre ?? null,
        cover: bookData.cover ?? '',
        isbn: bookData.isbn ?? '',
        description: bookData.description ?? '',
        notes: bookData.notes ?? null,
        status: dbStatus,
        rating: dbRating,
        author: {
          connectOrCreate: {
            where: { name: bookData.author },
            create: { name: bookData.author },
          },
        },
      },
      include: {
        author: true,
      },
    });

    // Formata o retorno para o frontend
    const formattedBook = {
      ...newBook,
      author: newBook.author.name,
      status: mapStatusToFrontend(newBook.status),
      rating: mapRatingToFrontend(newBook.rating),
    };

    return NextResponse.json(
      { message: 'Livro adicionado com sucesso!', book: formattedBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao salvar livro:', error);

    // Tratamento de erro para ISBN duplicado
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'Este ISBN já está cadastrado.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message:
          'Erro interno do servidor ao adicionar o livro. Verifique a conexão com o banco de dados.',
      },
      { status: 500 }
    );
  }
}