// app/api/book/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/_lib/prisma';
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client';
import { getUserFromToken } from '@/app/_lib/auth';

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

// --- Rotas Protegidas ---

// GET - Ver detalhes de UM livro (apenas se for do usuário)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Valida autenticação
    const userId = getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: true }
    });

    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }

    // VERIFICA SE O LIVRO PERTENCE AO USUÁRIO
    if (book.userId !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para acessar este livro" }, { status: 403 });
    }

    const formattedBook = {
      ...book,
      author: book.author ? book.author.name : 'Autor Desconhecido',
      status: mapStatusToFrontend(book.status),
      rating: mapRatingToFrontend(book.rating),
    };

    return NextResponse.json(formattedBook);
  } catch (error) {
    console.error("Erro no GET:", error);
    return NextResponse.json({ error: "Erro ao buscar livro" }, { status: 500 });
  }
}

// PUT - Editar livro (apenas se for do usuário)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Valida autenticação
    const userId = getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    // 1. BUSCA O LIVRO ATUAL
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
      select: { finishedPages: true, pages: true, userId: true }
    });

    if (!existingBook) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }

    // VERIFICA SE O LIVRO PERTENCE AO USUÁRIO
    if (existingBook.userId !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para editar este livro" }, { status: 403 });
    }

    // 2. VALIDAÇÃO ESPECÍFICA PARA 'finishedPages'
    if (body.finishedPages !== undefined) {
      const newFinishedPages = parseInt(body.finishedPages);
      const currentFinishedPages = existingBook.finishedPages || 0;

      if (isNaN(newFinishedPages) || newFinishedPages < 0) {
        return NextResponse.json({ error: "O número de páginas lidas é inválido." }, { status: 400 });
      }

      if (newFinishedPages < currentFinishedPages) {
        return NextResponse.json({
          error: `O progresso atual (${currentFinishedPages}) não pode ser regredido para ${newFinishedPages}.`
        }, { status: 400 });
      }

      if (newFinishedPages > existingBook.pages) {
        return NextResponse.json({
          error: `O total de páginas é ${existingBook.pages}. O progresso não pode exceder este valor.`
        }, { status: 400 });
      }
    }

    // 3. Prepara a atualização
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
      finishedPages: body.finishedPages,
      genre: body.genre,
      year: body.year,
      description: body.description,
      notes: body.notes,
      isbn: body.isbn,
      cover: body.cover,
    };

    // Lógica de Author
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

    // 4. ATUALIZAÇÃO SEGURA
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
    console.error("💥 Erro ao atualizar livro:", error);
    return NextResponse.json({
      error: "Erro ao atualizar livro",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

//  DELETE - Deletar livro (apenas se for do usuário)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Valida autenticação
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Busca o livro para verificar o dono
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { userId: true }
    });

    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }

    // VERIFICA SE O LIVRO PERTENCE AO USUÁRIO
    if (book.userId !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para deletar este livro" }, { status: 403 });
    }

    // Deleta o livro
    await prisma.book.delete({ where: { id: bookId } });

    return NextResponse.json({ message: "Livro removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    return NextResponse.json({ error: "Erro ao deletar livro" }, { status: 500 });
  }
}