import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/_lib/db"

//GET
export async function GET(req: Request, { params }: { params: {id: string} }){
    const book = await prisma.book.findUnique({ where: { id: parseInt(params.id) }}    
    );
    
    if (!book)
        return NextResponse.json({ error: "Livro não encontrado"}, { status: 404});

    return NextResponse.json(book);
}

//PUT
export async function PUT( req: Request, { params }: { params: { id: string} }){
    const body = await req.json();

    const updateBook = await prisma.book.update({
        where: { id: parseInt(params.id) },
        data: body,
    });

    return NextResponse.json(updateBook);
}

//DELETE
export async function  DELETE( req: Request, { params }: { params: { id: string} }
){
    await prisma.book.delete({
        where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Livro removido com sucesso"};)
}

