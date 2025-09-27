import { NextResponse } from "next/server";
import { prisma } from '@/_lib/db';

// Definição da interface para o contexto da rota (Next.js 15)
interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// GET
export async function GET(req: Request, context: RouteContext) {
    const { id: idParam } = await context.params; // Aguarda a Promise dos parâmetros
    const id = parseInt(idParam);
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });

    return NextResponse.json(book);
}

// PUT
export async function PUT(req: Request, context: RouteContext) {
    const { id: idParam } = await context.params; // Aguarda a Promise dos parâmetros
    const id = parseInt(idParam);
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();

    try {
        const updateBook = await prisma.book.update({ where: { id }, data: body });
        return NextResponse.json(updateBook);
    } catch {
        return NextResponse.json({ error: "Livro não encontrado ou dados inválidos" }, { status: 404 });
    }
}

// DELETE
export async function DELETE(req: Request, context: RouteContext) {
    const { id: idParam } = await context.params; // Aguarda a Promise dos parâmetros
    const id = parseInt(idParam);
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    try {
        await prisma.book.delete({ where: { id } });
        return NextResponse.json({ message: "Livro removido com sucesso" });
    } catch {
        return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
}