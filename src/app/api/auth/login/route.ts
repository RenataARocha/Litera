// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-temporario';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validação
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Email ou senha incorretos' },
                { status: 401 }
            );
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Email ou senha incorretos' },
                { status: 401 }
            );
        }

        // Gerar token JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}