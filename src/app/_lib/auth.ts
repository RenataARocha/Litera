// app/_lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-temporario';

interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

export function getUserFromToken(request: NextRequest): string | null {
    try {
        // Pega o token do header Authorization
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7); // Remove "Bearer "

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        return decoded.userId;
    } catch (error) {
        console.error('Erro ao validar token:', error);
        return null;
    }
}