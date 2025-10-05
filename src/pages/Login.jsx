'use client'

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const savedMessage = localStorage.getItem('loginMessage');
    if (savedMessage) {
      setMensagem(savedMessage);
      setTimeout(() => {
        localStorage.removeItem('loginMessage');
        setMensagem('');
      }, 5000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar token e dados do usuário
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirecionar para a página anterior ou home
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      localStorage.removeItem('loginMessage');
      
      window.location.href = redirectPath;
      
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
  <div 
    className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155]" 
    style={{ padding: "1rem" }}
  >
    <div className="w-full max-w-md">
      <div 
        className="bg-white dark:bg-transparent dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm rounded-2xl shadow-xl border border-blue-100" 
        style={{ padding: "2rem" }}
      >
        
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg" 
            style={{ marginBottom: "1rem" }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600" style={{ marginBottom: "0.5rem" }}>
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600 dark:text-blue-400">Entre com suas credenciais para continuar</p>
        </div>

        {mensagem && (
          <div 
            className="bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm animate-pulse" 
            style={{ marginBottom: "1.5rem", padding: "1rem" }}
          >
            {mensagem}
          </div>
        )}

        {erro && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" 
            style={{ marginBottom: "1.5rem", padding: "1rem" }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500" style={{ marginBottom: "0.5rem" }}>
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <Mail className="h-5 w-5 text-gray-400 dark:text-blue-200" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                style={{ paddingLeft: "3rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500" style={{marginTop: '0.6rem'}}>
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <Lock className="h-5 w-5 text-gray-400 dark:text-blue-200" />
              </div>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", marginTop: '0.6rem' }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 flex items-center text-gray-400 dark:text-blue-200 hover:text-gray-600 dark:hover:text-blue-400 transition-colors"
                style={{ paddingRight: "1rem" }}
              >
                {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{marginTop: '0.6rem'}}>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={lembrarMe}
                onChange={(e) => setLembrarMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-blue-400 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-blue-400 group-hover:text-blue-600 transition-colors" style={{marginLeft: '0.6rem'}}>
                Lembrar-me
              </span>
            </label>
            <a 
              href="/recuperar-senha" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", marginTop: '0.6rem' }}
          >
            {carregando ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5" style={{ marginRight: "0.75rem" }} viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: "1.5rem" }}>
          <p className="text-gray-600 dark:text-blue-200">
            Não tem uma conta?{' '}
            <a 
              href="/cadastro" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
            >
              Cadastre-se gratuitamente
            </a>
          </p>
        </div>
      </div>

      <p className="text-center text-gray-500 dark:text-blue-200 text-sm" style={{ marginTop: "1.5rem" }}>
        © 2024 Litera. Todos os direitos reservados.
      </p>
    </div>
  </div>
);
}