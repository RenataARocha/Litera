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
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const book = await prisma.book.findUnique({
    where: { id: bookId },
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

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // 1. BUSCA O LIVRO ATUAL PARA VALIDAÇÃO DE PROGRESSO
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
      // Precisamos do progresso atual e do total de páginas
      select: { finishedPages: true, pages: true }
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }

    // 2. VALIDAÇÃO ESPECÍFICA PARA 'finishedPages'
    if (body.finishedPages !== undefined) {
      const newFinishedPages = parseInt(body.finishedPages);
      const currentFinishedPages = existingBook.finishedPages || 0;

      if (isNaN(newFinishedPages) || newFinishedPages < 0) {
        return NextResponse.json({ error: "O número de páginas lidas é inválido." }, { status: 400 });
      }

      // Bloqueia a regressão do progresso
      if (newFinishedPages < currentFinishedPages) {
        return NextResponse.json({
          error: `O progresso atual (${currentFinishedPages}) não pode ser regredido para ${newFinishedPages}.`
        }, { status: 400 });
      }

      // Bloqueia progresso maior que o total do livro
      if (newFinishedPages > existingBook.pages) {
        return NextResponse.json({
          error: `O total de páginas é ${existingBook.pages}. O progresso não pode exceder este valor.`
        }, { status: 400 });
      }
    }

    // 3. Sua lógica original para mapear e preparar a atualização
    const dbStatus = body.status ? mapStatusToDB(body.status) : undefined;
    const dbRating = body.rating !== undefined ? mapRatingToDB(body.rating) : undefined;

    const dataToUpdate: Partial<{
      title: string;
      status: BookStatus;
      rating: BookRating | null;
      pages: number;
      finishedPages: number;
      genre: string;
      year: number;
      description: string;
      notes: string;
      isbn: string;
      cover: string;
      authorId: number;
    }> = {
      title: body.title,
      status: dbStatus,
      rating: dbRating,
      pages: body.pages,
      // O campo finishedPages agora será validado antes de ser usado
      finishedPages: body.finishedPages,
      genre: body.genre,
      year: body.year,
      description: body.description,
      notes: body.notes,
      isbn: body.isbn,
      cover: body.cover,
    };

    // Sua lógica original de Author
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
    (Object.keys(dataToUpdate) as Array<keyof typeof dataToUpdate>).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    console.log("Data to update:", dataToUpdate);

    // 4. ATUALIZAÇÃO SEGURA NO BANCO DE DADOS
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
    console.error("💥 Erro completo ao atualizar livro:", error);
    console.error("💥 Stack trace:", error instanceof Error ? error.stack : 'N/A');
    console.error("💥 Message:", error instanceof Error ? error.message : error);

    return NextResponse.json({
      error: "Erro ao atualizar livro",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }

}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    await prisma.book.delete({ where: { id: bookId } });
    return NextResponse.json({ message: "Livro removido com sucesso" });
  } catch {
    return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  }
}