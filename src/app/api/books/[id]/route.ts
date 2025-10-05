import { NextResponse } from "next/server";
import { prisma } from '@/_lib/db';
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client';

// --- Helpers ---
function mapStatusToFrontend(dbStatus: BookStatus): string {
  switch (dbStatus) {
    case BookStatus.READ: return 'Lido';
    case BookStatus.READING: return 'Lendo';
    case BookStatus.TO_READ: return 'Quero Ler';
    case BookStatus.PAUSED: return 'Pausado';
    case BookStatus.ABANDONED: return 'Abandonado';
    default: return 'Não Lido';
  }
}

function mapStatusToDB(status: string): BookStatus {
  switch (status.toLowerCase()) {
    case 'lido': return BookStatus.READ;
    case 'lendo': return BookStatus.READING;
    case 'quero ler': return BookStatus.TO_READ; 
    case 'pausado': return BookStatus.PAUSED;
    case 'abandonado': return BookStatus.ABANDONED;
    default: return BookStatus.TO_READ;
  }
}

function mapRatingToDB(rating: number): BookRating | null {
  switch (rating) {
    case 5: return BookRating.FIVE_STARS;
    case 4: return BookRating.FOUR_STARS;
    case 3: return BookRating.THREE_STARS;
    case 2: return BookRating.TWO_STARS;
    case 1: return BookRating.ONE_STAR;
    default: return null;
  }
}

// Faz o caminho inverso: enum -> número
function mapRatingToFrontend(rating: BookRating | null): number {
  switch (rating) {
    case BookRating.FIVE_STARS: return 5;
    case BookRating.FOUR_STARS: return 4;
    case BookRating.THREE_STARS: return 3;
    case BookRating.TWO_STARS: return 2;
    case BookRating.ONE_STAR: return 1;
    default: return 0;
  }
}

// --- Rotas ---
export async function GET(req: Request, { params }: { params: { id: string}}) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true }
  });

  if (!book) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });

  const formattedBook = {
    ...book,
    author: book.author ? book.author.name : 'Autor Desconhecido',
    status: mapStatusToFrontend(book.status),
    rating: mapRatingToFrontend(book.rating),
  };

  return NextResponse.json(formattedBook);
}

export async function PUT(req: Request, context: { params: Promise<{id: string}>}) {
  const { id } = await context.params;
  const bookId = parseInt(id);
  
  if (isNaN(bookId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const dbStatus = body.status ? mapStatusToDB(body.status) : undefined;
    const dbRating = body.rating !== undefined ? mapRatingToDB(body.rating) : undefined;

    const dataToUpdate: any = {
      title: body.title,
      status: dbStatus,
      rating: dbRating,
      pages: body.pages,
      finishedPages: body.finishedPages,
      genre: body.genre,
      year: body.year,
      description: body.description,
      notes: body.notes,
      isbn: body.isbn,
      cover: body.cover,
    };

    if (body.author) {
      const existingAuthor = await prisma.author.findUnique({ where: { name: body.author } });
      if (existingAuthor) {
        dataToUpdate.authorId = existingAuthor.id;
      } else {
        const newAuthor = await prisma.author.create({ data: { name: body.author } });
        dataToUpdate.authorId = newAuthor.id;
      }
    }

    // Remove campos undefined
    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    console.log("Data to update:", dataToUpdate);

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: dataToUpdate,
      include: { author: true },
    });

    const formattedBook = {
      ...updatedBook,
      author: updatedBook.author ? updatedBook.author.name : 'Autor Desconhecido',
      status: mapStatusToFrontend(updatedBook.status),
      rating: mapRatingToFrontend(updatedBook.rating),
    };

    return NextResponse.json(formattedBook, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ message: "Livro removido com sucesso" });
  } catch {
    return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  }
}
