// src/lib/auth.ts

// Verifica se usuário está logado
export const isUserLoggedIn = (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
};

// Redireciona para login salvando a página de origem
export const redirectToLogin = (message: string = 'Faça login para continuar'): void => {
    if (typeof window === 'undefined') return;

    // Salva a URL atual para retornar depois do login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);

    // Salva a mensagem para exibir na página de login
    localStorage.setItem('loginMessage', message);

    // Redireciona para a página de login
    window.location.href = '/login';
};

// Retorna para página anterior após login
export const redirectAfterLogin = (): void => {
    if (typeof window === 'undefined') return;

    const redirectPath = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    localStorage.removeItem('loginMessage');

    // Retorna para onde estava ou vai para o dashboard
    window.location.href = redirectPath || '/';
};

// Função para proteger ações
export const handleProtectedAction = (targetPath: string, message?: string): void => {
    if (!isUserLoggedIn()) {
        localStorage.setItem('redirectAfterLogin', targetPath);
        localStorage.setItem('loginMessage', message || 'Faça login para continuar');
        window.location.href = '/login';
    } else {
        window.location.href = targetPath;
    }
};