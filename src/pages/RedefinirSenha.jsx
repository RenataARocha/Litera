'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RedefinirSenha() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const tokenParam = searchParams?.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setErro('Token inválido');
        }
    }, [searchParams]);

    const validarSenha = (senha) => {
        return senha.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!validarSenha(senha)) {
            setErro('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao redefinir senha');
            }

            setSucesso(true);

            // Redirecionar para login após 3 segundos
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    const forcaSenha = () => {
        if (!senha) return { texto: '', cor: '', largura: '0%' };

        let forca = 0;
        if (senha.length >= 6) forca++;
        if (senha.length >= 8) forca++;
        if (/[A-Z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[^A-Za-z0-9]/.test(senha)) forca++;

        if (forca <= 2) return { texto: 'Fraca', cor: 'bg-red-500 wood:bg-accent-600', largura: '33%' };
        if (forca <= 3) return { texto: 'Média', cor: 'bg-yellow-500 wood:bg-accent-500', largura: '66%' };
        return { texto: 'Forte', cor: 'bg-green-500 wood:bg-accent-400', largura: '100%' };
    };

    const forca = forcaSenha();

    if (!token) {
        return (
            <div 
                className="min-h-screen  flex items-center justify-center bg-blue-100/60 dark:bg-slate-900 wood:bg-background" 
                style={{ padding: "1rem" }}
            >
                <div 
                    className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-blue-100 dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm wood:bg-primary-900 wood:shadow-lg wood:shadow-accent-700 wood:border-transparent max-w-md w-full text-center" 
                    style={{ padding: "2rem" }}
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-blue-200 wood:bg-accent-900 rounded-full" style={{ marginBottom: "1.5rem" }}>
                        <AlertCircle className="w-10 h-10 text-red-600 wood:text-accent-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-blue-600 wood:text-foreground" style={{ marginBottom: "0.5rem" }}>
                        Link Inválido
                    </h1>
                    <p className="text-gray-600 dark:text-blue-400 wood:text-secondary-100" style={{ marginBottom: "1.5rem" }}>
                        Este link de recuperação é inválido ou expirou.
                    </p>
                    <a 
                        href="/recuperar-senha"
                        className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl wood:from-accent-500 wood:to-accent-600 wood:hover:from-accent-600 wood:hover:to-accent-400"
                        style={{ padding: "0.75rem 1.5rem" }}
                    >
                        Solicitar novo link
                    </a>
                </div>
            </div>
        );
    }

    if (sucesso) {
        return (
            <div 
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] wood:bg-background" 
                style={{ padding: "1rem" }}
            >
                <div 
                    className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-blue-100 dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm wood:bg-primary-900 wood:shadow-lg wood:shadow-accent-700 wood:border-transparent max-w-md w-full text-center" 
                    style={{ padding: "2rem" }}
                >
                    <div 
                        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 wood:bg-green-900/30 rounded-full animate-bounce" 
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-600 wood:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600 wood:text-foreground" style={{ marginBottom: "0.5rem" }}>
                        Senha redefinida!
                    </h1>
                    <p className="text-gray-600 dark:text-blue-400 wood:text-secondary-100" style={{ marginBottom: "1rem" }}>
                        Sua senha foi alterada com sucesso.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-blue-300 wood:text-secondary-200">
                        Redirecionando para o login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] wood:bg-background" 
            style={{ padding: "1rem" }}
        >
            <div className="w-full max-w-md">
                <div 
                    className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-blue-100 dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm wood:bg-primary-900 wood:shadow-lg wood:shadow-accent-700 wood:border-transparent" 
                    style={{ padding: "2rem" }}
                >
                    <div className="text-center" style={{ marginBottom: "2rem" }}>
                        <div 
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 wood:bg-accent-500 rounded-full shadow-lg" 
                            style={{ marginBottom: "1rem" }}
                        >
                            <Lock className="w-8 h-8 text-white wood:text-accent-50" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600 wood:text-foreground" style={{ marginBottom: "0.5rem" }}>
                            Nova Senha
                        </h1>
                        <p className="text-gray-600 dark:text-blue-400 wood:text-secondary-100">
                            Crie uma senha forte e segura
                        </p>
                    </div>

                    {erro && (
                        <div 
                            className="bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm wood:bg-accent-50 wood:border-accent-400 wood:text-accent-700" 
                            style={{ padding: "1rem", marginBottom: "1.5rem" }}
                        >
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nova Senha */}
                        <div>
                            <label 
                                className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" 
                                style={{ marginBottom: "0.5rem" }}
                            >
                                Nova senha
                            </label>
                            <div className="relative">
                                <div 
                                    className="absolute inset-y-0 left-0 flex items-center pointer-events-none" 
                                    style={{ paddingLeft: "1rem" }}
                                >
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
                                </div>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    className="w-full border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:bg-primary-800 wood:text-foreground wood:border-secondary-500 wood:focus:ring-accent-500"
                                    style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 dark:text-blue-200 wood:text-secondary-100 hover:text-gray-600 dark:hover:text-blue-400 wood:hover:text-accent-300 transition-colors"
                                    style={{ paddingRight: "1rem" }}
                                >
                                    {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {senha && (
                                <div style={{ marginTop: "0.5rem" }}>
                                    <div className="flex items-center justify-between" style={{ marginBottom: "0.25rem" }}>
                                        <span className="text-xs text-gray-600 dark:text-blue-400 wood:text-secondary-100">Força da senha:</span>
                                        <span className={`text-xs font-semibold ${
                                            forca.texto === 'Fraca' ? 'text-red-600 wood:text-accent-400' :
                                            forca.texto === 'Média' ? 'text-yellow-600 wood:text-accent-500' :
                                            'text-green-600 wood:text-accent-400'
                                        }`}>
                                            {forca.texto}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-blue-900/30 wood:bg-primary-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${forca.cor}`}
                                            style={{ width: forca.largura }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label 
                                className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" 
                                style={{ marginBottom: "0.5rem" }}
                            >
                                Confirmar senha
                            </label>
                            <div className="relative">
                                <div 
                                    className="absolute inset-y-0 left-0 flex items-center pointer-events-none" 
                                    style={{ paddingLeft: "1rem" }}
                                >
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
                                </div>
                                <input
                                    type={mostrarConfirmarSenha ? "text" : "password"}
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    required
                                    className="w-full border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:bg-primary-800 wood:text-foreground wood:border-secondary-500 wood:focus:ring-accent-500"
                                    style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 dark:text-blue-200 wood:text-secondary-100 hover:text-gray-600 dark:hover:text-blue-400 wood:hover:text-accent-300 transition-colors"
                                    style={{ paddingRight: "1rem" }}
                                >
                                    {mostrarConfirmarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {confirmarSenha && senha === confirmarSenha && (
                                <div className="flex items-center text-green-600 wood:text-green-400 text-sm" style={{ marginTop: "0.5rem" }}>
                                    <CheckCircle2 className="h-4 w-4" style={{ marginRight: "0.25rem" }} />
                                    <span>As senhas coincidem</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl wood:from-accent-500 wood:to-accent-600 wood:focus:ring-accent-300 wood:hover:to-accent-400 wood:hover:from-accent-600"
                            style={{ padding: "0.75rem", marginTop: "0.6rem" }}
                        >
                            {carregando ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5" style={{ marginRight: "0.75rem" }} viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Redefinindo...
                                </div>
                            ) : (
                                'Redefinir senha'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 dark:text-blue-200 wood:text-secondary-200 text-sm" style={{ marginTop: "1.5rem" }}>
                    © 2024 Litera. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}