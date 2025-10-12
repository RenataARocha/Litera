import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';

export async function POST(request: Request) {
    try {
        const { bookId, pagesRead, readingTimeMin } = await request.json();

        if (!bookId || pagesRead === undefined || !readingTimeMin) {
            return NextResponse.json(
                { message: 'Dados incompletos.' },
                { status: 400 }
            );
        }

        // Busca ou cria o CurrentReading
        let currentReading = await prisma.currentReading.findUnique({
            where: { bookId: Number(bookId) }
        });

        if (!currentReading) {
            currentReading = await prisma.currentReading.create({
                data: {
                    bookId: Number(bookId),
                    currentPage: pagesRead
                }
            });
        }

        // Atualiza o livro
        await prisma.book.update({
            where: { id: Number(bookId) },
            data: {
                finishedPages: pagesRead,
                status: pagesRead > 0 ? 'READING' : 'TO_READ'
            }
        });

        // Atualiza currentPage no CurrentReading
        await prisma.currentReading.update({
            where: { id: currentReading.id },
            data: { currentPage: pagesRead }
        });

        // Cria o registro de progresso
        const progressUpdate = await prisma.progressUpdate.create({
            data: {
                readingId: currentReading.id,
                pagesRead: pagesRead,
                readingTimeMin: readingTimeMin
            }
        });

        return NextResponse.json({
            message: 'Progresso atualizado com sucesso!',
            progressUpdate
        }, { status: 200 });

    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        return NextResponse.json(
            { message: 'Erro ao salvar progresso.' },
            { status: 500 }
        );
    }
}