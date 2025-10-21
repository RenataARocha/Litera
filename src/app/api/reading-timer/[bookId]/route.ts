// app/api/reading-timer/[bookId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';
import { getUserFromToken } from '@/app/_lib/auth';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ bookId: string }> }
) {
    try {
        const userId = getUserFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const { bookId } = await context.params;
        const bookIdNum = parseInt(bookId);

        if (isNaN(bookIdNum)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        // Verificar se o livro pertence ao usuário
        const book = await prisma.book.findUnique({
            where: { id: bookIdNum },
            select: { userId: true }
        });

        if (!book || book.userId !== userId) {
            return NextResponse.json(
                { error: 'Livro não encontrado ou sem permissão' },
                { status: 403 }
            );
        }

        // Buscar timer
        const currentReading = await prisma.currentReading.findUnique({
            where: { bookId: bookIdNum },
            select: {
                totalSeconds: true,
                isTimerRunning: true,
                lastStartedAt: true
            }
        });

        if (!currentReading) {
            return NextResponse.json({
                totalSeconds: 0,
                isTimerRunning: false,
                lastStartedAt: null
            });
        }

        // Se o timer está rodando, calcular tempo adicional desde lastStartedAt
        let totalSeconds = currentReading.totalSeconds;

        if (currentReading.isTimerRunning && currentReading.lastStartedAt) {
            const now = new Date();
            const elapsed = Math.floor(
                (now.getTime() - currentReading.lastStartedAt.getTime()) / 1000
            );
            totalSeconds += elapsed;
        }

        return NextResponse.json({
            totalSeconds,
            isTimerRunning: currentReading.isTimerRunning,
            lastStartedAt: currentReading.lastStartedAt
        });

    } catch (error) {
        console.error('Erro ao buscar timer:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar timer' },
            { status: 500 }
        );
    }
}