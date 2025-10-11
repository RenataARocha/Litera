'use client'

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

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

    if (!aceitarTermos) {
      setErro('Você deve aceitar os termos de uso');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer cadastro');
      }

      // Salvar token e dados do usuário
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirecionar
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

  const forcaSenha = () => {
    if (!senha) return { texto: '', cor: '', largura: '0%' };
    
    let forca = 0;
    if (senha.length >= 6) forca++;
    if (senha.length >= 8) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;

    if (forca <= 2) return { texto: 'Fraca', cor: 'bg-red-500', largura: '33%' };
    if (forca <= 3) return { texto: 'Média', cor: 'bg-yellow-500', largura: '66%' };
    return { texto: 'Forte', cor: 'bg-green-500', largura: '100%' };
  };

  const forca = forcaSenha();

 return (
  <div 
    className="min-h-screen flex items-center justify-center bg-blue-100/60 dark:bg-slate-900 wood:bg-background" 
    style={{ padding: "1rem" }}
  >
    <div className="w-full max-w-md">
      <div 
        className="bg-white dark:bg-transparent rounded-2xl shadow-xl  border-blue-100 dark:border-transparent dark:shadow-[#3b82f6] dark:shadow-sm wood:bg-primary-900 wood:shadow-lg wood:shadow-accent-700" 
        style={{ padding: "2rem" }}
      >
        
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <div 
            className="inline-flex items-center justify-center w-16 h-16  bg-blue-500 wood:bg-accent-500 rounded-full shadow-lg" 
            style={{ marginBottom: "1rem" }}
          >
            <svg className="w-8 h-8 text-white wood:text-accent-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-blue-600 wood:text-foreground" style={{ marginBottom: "0.5rem" }}>
            Crie sua conta
          </h1>
          <p className="text-gray-600 dark:text-blue-400 wood:text-secondary-100">Comece sua jornada literária hoje</p>
        </div>

        {erro && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm wood:bg-accent-50 wood:border-accent-400 wood:text-accent-700" 
            style={{ marginBottom: "1.5rem", padding: "1rem" }}
          >
            {erro}
          </div>
        )}

        <div className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" style={{ marginBottom: "0.5rem" }}>
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <User className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
              </div>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
                className="w-full bg-white border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:!bg-primary-800 wood:!text-foreground wood:!border-secondary-500 wood:focus:!ring-accent-500 wood:placeholder:text-secondary-300"
                style={{ paddingLeft: "3rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" style={{ marginBottom: "0.5rem", marginTop: '0.9rem' }}>
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <Mail className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-white border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:!bg-primary-800 wood:!text-foreground wood:!border-secondary-500 wood:focus:!ring-accent-500 wood:placeholder:text-secondary-300"
                style={{ paddingLeft: "3rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" style={{ marginBottom: "0.5rem", marginTop: '0.9rem' }}>
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <Lock className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
              </div>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full bg-white border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:!bg-primary-800 wood:!text-foreground wood:!border-secondary-500 wood:focus:!ring-accent-500 wood:placeholder:text-secondary-300"
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
                    forca.texto === 'Fraca' ? 'text-red-600 wood:text-red-400' : 
                    forca.texto === 'Média' ? 'text-yellow-600 wood:text-yellow-400' : 
                    'text-green-600 wood:text-green-400'
                  }`}>
                    {forca.texto}
                  </span>
                </div>
                <div className="w-full bg-gray-200 wood:bg-primary-800/50 rounded-full h-2">
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-blue-500 wood:text-foreground" style={{ marginBottom: "0.5rem", marginTop: '0.9rem' }}>
              Confirmar senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{ paddingLeft: "1rem" }}>
                <Lock className="h-5 w-5 text-gray-400 dark:text-blue-200 wood:text-secondary-400" />
              </div>
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                required
                className="w-full bg-white border border-gray-300 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:bg-slate-800 dark:text-white wood:!bg-primary-800 wood:!text-foreground wood:!border-secondary-500 wood:focus:!ring-accent-500 wood:placeholder:text-secondary-300"
                style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 dark:text-blue-200 dark:hover:text-blue-400 wood:text-secondary-100 wood:hover:text-accent-300 transition-colors"
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

          {/* Checkbox */}
          <div>
            <label className="flex items-start cursor-pointer group" style={{marginTop: '0.9rem'}}>
              <input
                type="checkbox"
                checked={aceitarTermos}
                onChange={(e) => setAceitarTermos(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-blue-400 wood:border-secondary-500 rounded focus:ring-blue-500 mt-1 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-blue-200 wood:text-secondary-100 group-hover:text-blue-600 wood:group-hover:text-accent-400 transition-colors" style={{marginLeft: '0.6rem'}}>
                Eu concordo com os{' '}
                <a href="/termos" className="text-blue-600 wood:text-accent-500 hover:underline font-medium">
                  Termos de Uso
                </a>
                {' '}e{' '}
                <a href="/privacidade" className="text-blue-600 wood:text-accent-500 hover:underline font-medium">
                  Política de Privacidade
                </a>
              </span>
            </label>
          </div>

          {/* Botão */}
          <button
            onClick={handleSubmit}
            disabled={carregando}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl wood:from-accent-500 wood:to-accent-600 wood:focus:ring-accent-300 wood:hover:to-accent-400 wood:hover:from-accent-600"
            style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", marginTop: '0.9rem' }}
          >
            {carregando ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5" style={{ marginRight: "0.75rem" }} viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Criando conta...
              </div>
            ) : (
              'Cadastrar'
            )}
          </button>
        </div>

        <div className="text-center" style={{ marginTop: "1.5rem" }}>
          <p className="text-gray-600 dark:text-blue-200 wood:text-secondary-100">
            Já tem uma conta?{' '}
            <a 
              href="/login" 
              className="text-blue-600 wood:text-accent-500 hover:text-blue-700 wood:hover:text-accent-600 font-semibold hover:underline transition-all"
            >
              Faça login
            </a>
          </p>
        </div>
      </div>

      <p className="text-center text-gray-500 dark:text-blue-200 wood:text-secondary-200 text-sm" style={{ marginTop: "1.5rem" }}>
        © 2024 Litera. Todos os direitos reservados.
      </p>
    </div>
  </div>
);

}