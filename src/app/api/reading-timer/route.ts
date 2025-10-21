// app/api/reading-timer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';
import { getUserFromToken } from '@/app/_lib/auth';

export async function POST(request: NextRequest) {
    try {
        const userId = getUserFromToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { bookId, totalSeconds, isTimerRunning } = body;

        // Validação
        if (!bookId || totalSeconds === undefined) {
            return NextResponse.json(
                { error: 'Dados inválidos' },
                { status: 400 }
            );
        }

        // Verificar se o livro pertence ao usuário
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            select: { userId: true }
        });

        if (!book || book.userId !== userId) {
            return NextResponse.json(
                { error: 'Livro não encontrado ou sem permissão' },
                { status: 403 }
            );
        }

        // Buscar ou criar CurrentReading
        let currentReading = await prisma.currentReading.findUnique({
            where: { bookId }
        });

        if (!currentReading) {
            // Criar se não existe
            currentReading = await prisma.currentReading.create({
                data: {
                    bookId,
                    currentPage: 0,
                    totalSeconds,
                    isTimerRunning,
                    lastStartedAt: isTimerRunning ? new Date() : null
                }
            });
        } else {
            // Atualizar existente
            currentReading = await prisma.currentReading.update({
                where: { bookId },
                data: {
                    totalSeconds,
                    isTimerRunning,
                    lastStartedAt: isTimerRunning ? new Date() : currentReading.lastStartedAt
                }
            });
        }

        return NextResponse.json({
            success: true,
            timer: {
                totalSeconds: currentReading.totalSeconds,
                isTimerRunning: currentReading.isTimerRunning
            }
        });

    } catch (error) {
        console.error('Erro ao salvar timer:', error);
        return NextResponse.json(
            { error: 'Erro ao salvar timer' },
            { status: 500 }
        );
    }
}