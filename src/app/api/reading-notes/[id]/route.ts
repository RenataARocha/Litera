import { NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { content } = await request.json();
        const noteId = parseInt(id);

        if (!content?.trim()) {
            return NextResponse.json(
                { message: 'Conteúdo não pode estar vazio.' },
                { status: 400 }
            );
        }

        const updatedNote = await prisma.readingNote.update({
            where: { id: noteId },
            data: { content },
        });

        return NextResponse.json(
            { message: 'Anotação atualizada!', updatedNote },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao atualizar anotação:', error);
        return NextResponse.json(
            { message: 'Erro ao atualizar anotação.' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const noteId = parseInt(id);

        await prisma.readingNote.delete({
            where: { id: noteId },
        });

        return NextResponse.json(
            { message: 'Anotação deletada com sucesso!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao deletar anotação:', error);
        return NextResponse.json(
            { message: 'Erro ao deletar anotação.' },
            { status: 500 }
        );
    }
}