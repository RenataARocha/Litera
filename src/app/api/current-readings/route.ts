// src/app/api/current-readings/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma'; // Assumindo que você tem um utilitário prisma.ts

// --- FUNÇÃO GET: BUSCAR TODAS AS LEITURAS ATUAIS ---
export async function GET() {
    try {
        const currentReadings = await prisma.currentReading.findMany({
            // Inclui os dados do Livro (para título e total de páginas)
            // e os Progressos (para calcular estatísticas)
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        pages: true, // Total de páginas do livro
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
                        date: 'desc', // Para buscar o progresso mais recente
                    },
                },
            },
            where: {
                isPaused: false, // Busca apenas o que não está pausado
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
// Esta rota pode ser usada para:
// 1. INICIAR uma nova leitura (se o bookId não tiver CurrentReading)
// 2. ATUALIZAR o progresso de uma leitura existente (ProgressUpdate)
export async function POST(request: Request) {
    try {
        const { bookId, pagesRead, currentPage, readingTimeMin } = await request.json();

        if (!bookId || pagesRead === undefined || currentPage === undefined || readingTimeMin === undefined) {
            return NextResponse.json(
                { message: 'Campos obrigatórios ausentes.' },
                { status: 400 }
            );
        }

        // ... dentro da função POST:

        // 1. Tenta encontrar uma leitura atual para este livro
        let currentReading = await prisma.currentReading.findUnique({
            where: { bookId: bookId },
        });

        // 2. Se não existir, INICIA UMA NOVA LEITURA
        if (!currentReading) {
            // 2a. Cria o registro CurrentReading
            currentReading = await prisma.currentReading.create({
                data: {
                    bookId: bookId,
                    currentPage: currentPage,
                },
            });

            // 2b. ATUALIZA O STATUS do livro (OPERAÇÃO SEPARADA)
            await prisma.book.update({
                where: { id: bookId },
                data: {
                    // Usa o valor READING do enum, em vez de uma string
                    status: 'READING',
                },
            });

        } else {
            // Se existir, apenas atualiza a página atual
            await prisma.currentReading.update({
                where: { id: currentReading.id },
                data: {
                    currentPage: currentPage,
                }
            });
        }
        // ... o restante da função POST (criação do ProgressUpdate) continua igual

        // 3. REGISTRA A SESSÃO DE LEITURA (ProgressUpdate)
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