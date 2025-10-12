// src/app/api/current-readings/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';

// --- FUNÇÃO GET: BUSCAR TODAS AS LEITURAS ATUAIS ---
export async function GET() {
    try {
        const currentReadings = await prisma.currentReading.findMany({
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        pages: true,
                        cover: true,
                        author: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                progressUpdates: {
                    orderBy: {
                        date: 'desc',
                    },
                },
            },
            where: {
                isPaused: false,
            },
            orderBy: {
                startedAt: 'asc',
            },
        });

        return NextResponse.json(currentReadings, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar leituras atuais:', error);
        return NextResponse.json(
            { message: 'Erro interno ao buscar leituras atuais.' },
            { status: 500 }
        );
    }
}

// --- FUNÇÃO POST: REGISTRAR ATUALIZAÇÃO DE PROGRESSO ---
export async function POST(request: Request) {
    try {
        const { bookId, pagesRead, currentPage, readingTimeMin } = await request.json();

        if (!bookId || pagesRead === undefined || currentPage === undefined || readingTimeMin === undefined) {
            return NextResponse.json(
                { message: 'Campos obrigatórios ausentes.' },
                { status: 400 }
            );
        }

        // 1. Tenta encontrar uma leitura atual para este livro
        let currentReading = await prisma.currentReading.findUnique({
            where: { bookId: bookId },
        });

        // 2. Se não existir, INICIA UMA NOVA LEITURA
        if (!currentReading) {
            // Cria o registro CurrentReading
            currentReading = await prisma.currentReading.create({
                data: {
                    bookId: bookId,
                    currentPage: currentPage,
                },
            });

            // Atualiza o status e finishedPages do livro
            await prisma.book.update({
                where: { id: bookId },
                data: {
                    status: 'READING',
                    finishedPages: currentPage,
                },
            });

        } else {
            // Se já existir, atualiza a página atual
            await prisma.currentReading.update({
                where: { id: currentReading.id },
                data: {
                    currentPage: currentPage,
                }
            });

            // Atualiza o finishedPages do livro
            await prisma.book.update({
                where: { id: bookId },
                data: {
                    finishedPages: currentPage,
                },
            });
        }

        // 3. Registra a sessão de leitura (ProgressUpdate)
        const newProgress = await prisma.progressUpdate.create({
            data: {
                readingId: currentReading.id,
                pagesRead: pagesRead,
                readingTimeMin: readingTimeMin,
            },
        });

        return NextResponse.json(
            {
                message: 'Progresso registrado com sucesso!',
                readingId: currentReading.id,
                newProgress
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao registrar progresso:', error);
        return NextResponse.json(
            { message: 'Erro interno ao registrar progresso.' },
            { status: 500 }
        );
    }
}