import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';

export async function POST(request: Request) {
    try {
        const { readingId, content } = await request.json();

        if (!readingId || !content?.trim()) {
            return NextResponse.json({ message: 'Campos obrigatórios ausentes.' }, { status: 400 });
        }

        const newNote = await prisma.readingNote.create({
            data: {
                readingId,
                content,
            },
        });

        return NextResponse.json({ message: 'Anotação salva com sucesso!', newNote }, { status: 200 });
    } catch (error) {
        console.error('Erro ao salvar anotação:', error);
        return NextResponse.json({ message: 'Erro interno ao salvar anotação.' }, { status: 500 });
    }
}

// Opcional: você pode criar GET para buscar as notas
export async function GET(request: Request) {
    try {
        const readingId = request.url.split('readingId=')[1];

        if (!readingId) {
            return NextResponse.json({ message: 'ID da leitura é obrigatório.' }, { status: 400 });
        }

        const notes = await prisma.readingNote.findMany({
            where: { readingId: Number(readingId) },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar notas:', error);
        return NextResponse.json({ message: 'Erro interno ao buscar notas.' }, { status: 500 });
    }
}
