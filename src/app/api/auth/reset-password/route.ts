// src/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = body;

        // Validações
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token e senha são obrigatórios' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'A senha deve ter no mínimo 6 caracteres' },
                { status: 400 }
            );
        }

        // Buscar usuário pelo token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Token ainda não expirou
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Token inválido ou expirado' },
                { status: 400 }
            );
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Atualizar senha e limpar token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Senha redefinida com sucesso!',
        });

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        return NextResponse.json(
            { error: 'Erro ao redefinir senha' },
            { status: 500 }
        );
    }
}