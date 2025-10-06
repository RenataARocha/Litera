'use client'

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('Por favor, insira um email válido');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar email');
      }

      setEnviado(true);
      
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleVoltar = () => {
    window.location.href = '/login';
  };

  const handleReenviar = () => {
    setEnviado(false);
    setEmail('');
  };

  return (
  <div 
    className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155]" 
    style={{ padding: "1rem" }}
  >
    <div className="w-full max-w-md">
      <div 
        className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-blue-100 dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm" 
        style={{ padding: "2rem" }}
      >
        
        {/* Botão Voltar */}
        <button
          onClick={handleVoltar}
          className="flex items-center text-gray-600 dark:text-blue-200 hover:text-blue-600 transition-colors group"
          style={{ marginBottom: "1.5rem" }}
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao login</span>
        </button>

        {!enviado ? (
          <>
            {/* Header */}
            <div className="text-center" style={{ marginBottom: "2rem" }}>
              <div 
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg" 
                style={{ marginBottom: "1rem" }}
              >
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600" style={{ marginBottom: "0.5rem" }}>
                Recuperar senha
              </h1>
              <p className="text-gray-600 dark:text-blue-400">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div 
                className="bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" 
                style={{ marginBottom: "1.5rem", padding: "1rem" }}
              >
                {erro}
              </div>
            )}

            {/* Formulário */}
            <div className="space-y-5">
              <div>
                <label 
                  className="block text-sm font-semibold text-gray-700 dark:text-blue-500" 
                  style={{ marginBottom: "0.5rem" }}
                >
                  Email
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-y-0 left-0 flex items-center pointer-events-none" 
                    style={{ paddingLeft: "1rem" }}
                  >
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

              <button
                onClick={handleSubmit}
                disabled={carregando || !email}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{ padding: "0.75rem", marginTop: '0.6rem' }}
              >
                {carregando ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5" style={{ marginRight: "0.75rem" }} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </div>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>
            </div>

            {/* Dicas de Segurança */}
            <div 
              className="bg-blue-50 rounded-lg border border-blue-100 dark:border-blue-400 dark:bg-blue-50/10" 
              style={{ marginTop: "1.5rem", padding: "1rem" }}
            >
              <p className="text-sm text-blue-800 dark:text-blue-500 font-medium" style={{ marginBottom: "0.5rem" }}>
                💡 Dica de segurança:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Verifique sua caixa de spam caso não receba o email</li>
                <li>• O link expira em 1 hora por segurança</li>
                <li>• Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Tela de Sucesso */}
            <div className="text-center">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full animate-bounce" 
                style={{ marginBottom: "1.5rem" }}
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600" style={{ marginBottom: "0.75rem" }}>
                Email enviado!
              </h1>
              
              <div 
                className="bg-green-50 border border-green-200 rounded-lg" 
                style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
              >
                <p className="text-gray-700 dark:text-blue-500" style={{ marginBottom: "0.5rem" }}>
                  Enviamos um link de recuperação para:
                </p>
                <p className="font-semibold text-blue-600 text-lg">
                  {email}
                </p>
              </div>

              <div 
                className="space-y-4 text-left bg-gray-50 rounded-lg" 
                style={{ padding: "1.25rem", marginBottom: "1.5rem" }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold" style={{ marginRight: "0.75rem" }}>
                    1
                  </div>
                  <p className="text-sm text-gray-700 dark:text-blue-500">
                    Verifique sua caixa de entrada
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold" style={{ marginRight: "0.75rem" }}>
                    2
                  </div>
                  <p className="text-sm text-gray-700 dark:text-blue-500">
                    Clique no link que enviamos
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold" style={{ marginRight: "0.75rem" }}>
                    3
                  </div>
                  <p className="text-sm text-gray-700 dark:text-blue-500">
                    Crie uma nova senha segura
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVoltar}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  style={{ padding: "0.75rem" }}
                >
                  Voltar ao login
                </button>

                <button
                  onClick={handleReenviar}
                  className="w-full bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                  style={{ padding: "0.75rem" }}
                >
                  Não recebeu? Reenviar email
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-gray-500 dark:text-blue-200 text-sm" style={{ marginTop: "1.5rem" }}>
        © 2024 Litera. Todos os direitos reservados.
      </p>
    </div>
  </div>
);

}