import { NextResponse } from "next/server";
import { prisma } from '@/_lib/db';
import { book_status as BookStatus, book_rating as BookRating } from '@prisma/client'

// Definição da interface para o contexto da rota (Next.js 15)
interface RouteContext {
    params: {
        id: string;
    };
}

export async function GET(req: Request, { params }: { params: { id: string}}) {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const book = await prisma.book.findUnique({
        where: { id },
        include: {author: true}
    });

    if (!book) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });

    const formattedBook = {
      ...book,
      author: book.author ? book.author.name : 'Autor Desconhecido',
      status: mapStatusToFrontend(book.status), 
      rating: book.rating ? book.rating.length : 0, 
    };

    return NextResponse.json(formattedBook);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

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

const updateBook = await prisma.book.update({ where: { id }, data: dataToUpdate });
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

const mapStatusToDB = (status: string): BookStatus => {
  switch (status.toLowerCase()) {
    case 'lido': return BookStatus.READ;
    case 'lendo': return BookStatus.READING;
    case 'quero ler': return BookStatus.TO_READ; 
    case 'pausado': return BookStatus.PAUSED;
    case 'abandonado': return BookStatus.ABANDONED;
    default: return BookStatus.TO_READ;
  }
};

const mapRatingToDB = (rating: number): BookRating | null => {
  switch (rating) {
    case 5: return BookRating.FIVE_STARS;
    case 4: return BookRating.FOUR_STARS;
    case 3: return BookRating.THREE_STARS;
    case 2: return BookRating.TWO_STARS;
    case 1: return BookRating.ONE_STAR;
    case 0: default: return null; 
  }
};