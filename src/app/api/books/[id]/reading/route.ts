import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const bookId = parseInt(id);

        if (isNaN(bookId)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        const reading = await prisma.currentReading.findFirst({
            where: {
                bookId: bookId,
            },
            orderBy: {
                startedAt: 'desc',
            },
        });

        if (!reading) {
            return NextResponse.json(
                { error: 'Nenhuma leitura em andamento encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({ readingId: reading.id });
    } catch (error) {
        console.error('Erro ao buscar reading:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar leitura' },
            { status: 500 }
        );
    }
}