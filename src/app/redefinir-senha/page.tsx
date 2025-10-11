import { Suspense } from 'react';
import RedefinirSenha from '@/pages/RedefinirSenha';

export const metadata = {
    title: 'Redefinir Senha',
    description: 'Crie uma nova senha para sua conta Litera'
};

export default function RedefinirSenhaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        }>
            <RedefinirSenha />
        </Suspense>
    );
}