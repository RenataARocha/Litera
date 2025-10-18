// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma'; // ✅ CORRIGIDO
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client';
import { getUserFromToken } from '@/app/_lib/auth';

// Mapeia status do frontend para o banco
const mapStatusToDB = (status: string): BookStatus => {
  switch (status.toLowerCase()) {
    case 'lido': return BookStatus.READ;
    case 'lendo': return BookStatus.READING;
    case 'quero ler':
    case 'não lido': return BookStatus.TO_READ;
    case 'pausado': return BookStatus.PAUSED;
    case 'abandonado': return BookStatus.ABANDONED;
    default: return BookStatus.TO_READ;
  }
};

// Mapeia rating numérico para enum do banco
const mapRatingToDB = (rating: number): BookRating | null => {
  switch (rating) {
    case 5: return BookRating.FIVE_STARS;
    case 4: return BookRating.FOUR_STARS;
    case 3: return BookRating.THREE_STARS;
    case 2: return BookRating.TWO_STARS;
    case 1: return BookRating.ONE_STAR;
    case 0:
    default: return null;
  }
};

// Mapeia enum do banco para string amigável
const mapStatusToFrontend = (dbStatus: BookStatus): string => {
  switch (dbStatus) {
    case BookStatus.READ: return 'Lido';
    case BookStatus.READING: return 'Lendo';
    case BookStatus.TO_READ: return 'Quero Ler';
    case BookStatus.PAUSED: return 'Pausado';
    case BookStatus.ABANDONED: return 'Abandonado';
    default: return 'Não Lido';
  }
};

// Mapeia enum do banco para número
const mapRatingToFrontend = (rating: BookRating | null): number => {
  if (!rating) return 0;
  switch (rating) {
    case BookRating.FIVE_STARS: return 5;
    case BookRating.FOUR_STARS: return 4;
    case BookRating.THREE_STARS: return 3;
    case BookRating.TWO_STARS: return 2;
    case BookRating.ONE_STAR: return 1;
    default: return 0;
  }
};

//  GET - Buscar APENAS livros do usuário logado
export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { message: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    const books = await prisma.book.findMany({
      where: {
        userId: userId,
      },
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
    console.error('❌ Erro ao buscar livros:', error);
    return NextResponse.json(
      {
        message: 'Erro interno do servidor ao buscar os livros.',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

//  POST - Criar livro COM userId
export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { message: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      );
    }

    const bookData = await request.json();

    console.log('📚 Dados recebidos:', bookData);
    console.log('👤 UserId:', userId);

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

    // Gera ISBN único se não fornecido
    const isbn = bookData.isbn || `ISBN-${Date.now()}-${userId}-${Math.random().toString(36).substring(7)}`;

    console.log('💾 Tentando salvar no banco...');

    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        year: bookData.year ?? null,
        pages: bookData.pages ?? 0,
        finishedPages: bookData.finishedPages ?? 0,
        genre: bookData.genre ?? null,
        cover: bookData.cover || '',
        isbn: isbn,
        description: bookData.description || '',
        notes: bookData.notes ?? null,
        status: dbStatus,
        rating: dbRating,
        user: {
          connect: { id: userId } //  CORRIGIDO: conecta através da relação
        },
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

    console.log(' Livro criado com sucesso:', newBook.id);

    // Formata o retorno para o frontend
    const formattedBook = {
      id: newBook.id,
      title: newBook.title,
      year: newBook.year,
      pages: newBook.pages,
      finishedPages: newBook.finishedPages,
      genre: newBook.genre,
      cover: newBook.cover,
      isbn: newBook.isbn,
      description: newBook.description,
      notes: newBook.notes,
      createdAt: newBook.createdAt,
      updatedAt: newBook.updatedAt,
      author: newBook.author?.name || 'Autor Desconhecido',
      status: mapStatusToFrontend(newBook.status),
      rating: mapRatingToFrontend(newBook.rating),
    };

    return NextResponse.json(
      { message: 'Livro adicionado com sucesso!', book: formattedBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao salvar livro:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');

    // Tratamento de erro para ISBN duplicado
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'Este ISBN já está cadastrado. Tente outro ou deixe em branco.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'Erro interno do servidor ao adicionar o livro.',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}