'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";



interface IndustryIdentifier {
  type: string;
  identifier: string;
}

interface VolumeInfo {
  authors?: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  publishedDate?: string;
  industryIdentifiers?: IndustryIdentifier[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

interface BookItem {
  volumeInfo: VolumeInfo;
}

interface GoogleBooksResponse {
  items?: BookItem[];
}


export default function NewBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    pages: '',
    genre: '',
    status: 'quero ler',
    rating: 0,
    cover: '',
    isbn: '',
    description: '',
    notes: '',
    techInfo: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFormOpen] = useState(true);
  const router = useRouter();



  // 🔍 Busca automática no Google Books API quando o título muda
  useEffect(() => {
    if (formData.title.length < 3 && formData.author.length < 3) return;

    const buscarLivro = async () => {
      try {
        const query = formData.title
          ? `intitle:${formData.title}`
          : `inauthor:${formData.author}`;

        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );
        const data: GoogleBooksResponse = await res.json();

        if (data.items && data.items.length > 0) {
          // Escolhe o livro com mais informações disponíveis
          const melhorLivro = data.items.find(item => item.volumeInfo.description && item.volumeInfo.imageLinks) ?? data.items[0];
          if (!melhorLivro) return; // protege caso não tenha nenhum item


          const info = melhorLivro.volumeInfo;

          setFormData(prev => ({
            ...prev,
            author: info.authors ? info.authors.join(", ") : prev.author,
            description: info.description || prev.description,
            pages: info.pageCount ? String(info.pageCount) : prev.pages,
            genre: info.categories ? info.categories[0] : prev.genre,
            year: info.publishedDate ? info.publishedDate.split('-')[0] : prev.year,
            isbn: info.industryIdentifiers
              ? info.industryIdentifiers.map((id) => id.identifier).join(", ")
              : prev.isbn,
            cover:
              info.imageLinks?.thumbnail ||
              info.imageLinks?.smallThumbnail ||
              prev.cover,
            techInfo: info.industryIdentifiers
              ? `ISBN: ${info.industryIdentifiers
                .map((id) => `${id.type}: ${id.identifier}`)
                .join(" | ")}`
              : prev.techInfo,
          }));

        }
      } catch (error) {
        console.error("Erro ao buscar dados do livro:", error);
      }
    };

    const timeoutId = setTimeout(buscarLivro, 800);
    return () => clearTimeout(timeoutId);
  }, [formData.title, formData.author]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //  Pega o token do localStorage (salvo durante o login)
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Você precisa estar logado para adicionar um livro.');
        // Salva onde o usuário estava para voltar depois do login
        localStorage.setItem('redirectAfterLogin', '/books/new');
        router.push('/login');
        return;
      }

      // Envia os dados para a API COM O TOKEN
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          year: formData.year ? parseInt(formData.year) : null,
          pages: formData.pages ? parseInt(formData.pages) : 0,
          genre: formData.genre || null,
          status: formData.status,
          rating: formData.rating,
          cover: formData.cover || '',
          isbn: formData.isbn || '',
          description: formData.description || '',
          notes: formData.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro ao salvar livro');

        // Se o token expirou ou é inválido, redireciona para login
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.setItem('loginMessage', 'Sua sessão expirou. Faça login novamente.');
          router.push('/login');
        }
        return;
      }

      console.log('Livro salvo com sucesso:', data.book);
      setShowSuccessModal(true);

      setTimeout(() => {
        router.push('/books');
      }, 800);

    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      alert('Erro ao salvar livro. Tente novamente.');
    }
  };


  const progress = () => {
    let filled = 0;
    if (formData.title) filled += 1;
    if (formData.author) filled += 1;
    if (formData.year) filled += 1;
    if (formData.pages) filled += 1;
    if (formData.genre) filled += 1;
    if (formData.cover) filled += 1;
    return Math.floor((filled / 6) * 100);
  };

  const progressMessage = () => {
    const p = progress();
    if (p === 0) return 'Comece preenchendo o formulário! 📖';
    if (p <= 40) return 'Você está indo bem! ✨';
    if (p <= 80) return 'Quase lá! 💪';
    return 'Uau! Formulário quase completo! 🎉';
  };

  const progressColor = () => {
    const p = progress();
    if (p <= 40) return 'bg-red-500';
    if (p <= 80) return 'bg-yellow-400';
    return 'bg-blue-600';
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, x: -20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    },
  };

  const progressBarVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0, originX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showSuccessModal && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce"
            style={{ padding: "1rem", margin: "0.5rem" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-lg">Sucesso!</p>
              <p className="text-sm">Livro adicionado com sucesso ✨</p>
            </div>
          </div>
        </div>
      )}


      <div className="flex items-center justify-center min-h-screen" style={{ margin: "2rem" }}>
        <motion.div
          className="max-w-3xl w-full p-4 bg-white rounded-xl shadow-lg
          dark:bg-slate-800/90 dark:border-slate-700 dark:shadow-[#3b82f6] dark:border-none
          wood:bg-primary-800 wood:shadow-accent-500"
          style={{ margin: "auto", padding: "1rem", boxSizing: "border-box" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={headerVariants} style={{ marginBottom: "1rem" }}>
            <motion.h1
              className="text-2xl font-bold text-gray-900 dark:text-blue-400 wood:text-primary-100"
              style={{ marginBottom: "0.25rem" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Adicionar Novo Livro
            </motion.h1>
            <motion.p
              className="text-sm text-gray-900 dark:text-blue-200 wood:text-accent-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Preencha as informações para catalogar seu livro
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <motion.div
              className="w-full bg-gray-200 rounded-full h-4 mb-1"
              role="progressbar"
              aria-valuenow={progress()}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso do preenchimento do formulário"
              variants={progressBarVariants}
            >
              <motion.div
                className={`${progressColor()} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${progress()}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress()}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
              />
            </motion.div>
            <motion.p
              className="text-sm text-gray-700 dark:text-blue-200 wood:text-primary-100"
              style={{ marginBottom: "1rem", padding: "0.5rem" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              aria-live="polite"
            >
              {progress()}% preenchido - {progressMessage()}
            </motion.p>
          </motion.div>

          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              aria-label="Formulário para adicionar novo livro"
            >

              <motion.div
                variants={itemVariants}
                className="bg-red-50 rounded-lg dark:bg-blue-200/10 wood:bg-accent-300/60"
                style={{ padding: "1rem" }}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <h3
                  className="text-lg font-semibold text-red-800 dark:text-rose-600 wood:text-red-900"
                  style={{ marginBottom: "1rem" }}
                >
                  <span className="text-red-500">*</span> Informações Obrigatórias
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-900"
                    >
                      Título <span className="text-red-500 dark:text-rose-500">*</span>
                    </label>
                    <motion.input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                    wood:bg-primary-100 wood:border-primary-100 wood:focus:ring-accent-600"
                      style={{ padding: "0.3rem", paddingLeft: "0.7rem" }}
                      placeholder="Digite o título do livro"
                      required
                      aria-required="true"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-900"
                    >
                      Autor <span className="text-red-500 dark:text-rose-500">*</span>
                    </label>
                    <motion.input
                      id="author"
                      name="author"
                      type="text"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300 wood:bg-primary-100 wood:border-primary-100 wood:focus:ring-accent-600"
                      style={{ padding: "0.3rem", paddingLeft: "0.7rem" }}
                      placeholder="Digite o autor"
                      required
                      aria-required="true"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-blue-50 rounded-lg dark:bg-blue-200/10 wood:bg-primary-200"
                style={{ padding: '1rem' }}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 wood:text-secondary-900" style={{ marginBottom: '1rem' }}>
                  Informações Adicionais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">
                      Ano de Publicação
                    </label>
                    <motion.input
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                    wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      placeholder="Ex: 2023"
                      aria-label="Ano de Publicação"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">
                      Total de Páginas
                    </label>
                    <motion.input
                      name="pages"
                      type="number"
                      value={formData.pages}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                    wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      placeholder="Ex: 250"
                      aria-label="Total de Páginas"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">Gênero</label>
                    <motion.select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="w-full cursor-pointer px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                    wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      aria-label="Selecione o gênero do livro"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="">Selecione</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Literatura Brasileira">📚 Literatura Brasileira</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção Científica">🚀 Ficção Científica</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Realismo Mágico">✨ Realismo Mágico</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ficção">📖 Ficção</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fantasia">🐉 Fantasia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Romance">💕 Romance</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Biografia">👤 Biografia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="História">🏛️ História</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Autoajuda">💪 Autoajuda</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Tecnologia">💻 Tecnologia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Programação">⌨️ Programação</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Negócios">💼 Negócios</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Psicologia">🧠 Psicologia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Filosofia">🤔 Filosofia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Poesia">🎭 Poesia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Suspense">🕵️‍♀️ Suspense</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Terror">👻 Terror</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Mistério">🧩 Mistério</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Thriller">🔪 Thriller</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Drama">🎬 Drama</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Aventura">🏔️ Aventura</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Clássicos">🏺 Clássicos</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Infantil">🧸 Infantil</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Juvenil">🎒 Juvenil</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="HQs e Mangás">🦸 HQs e Mangás</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Artes">🎨 Artes</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Música">🎵 Música</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cinema e TV">📺 Cinema e TV</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Educação">📘 Educação</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Religião">🙏 Religião</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Espiritualidade">🌙 Espiritualidade</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ciência">🔬 Ciência</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Matemática">📏 Matemática</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Saúde">🩺 Saúde</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Nutrição">🥗 Nutrição</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Esportes">⚽ Esportes</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Culinária">🍳 Culinária</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Viagens">✈️ Viagens</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Moda">👗 Moda</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Beleza">💅 Beleza</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Política">🏛️ Política</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Sociologia">🌍 Sociologia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ecologia">🌱 Ecologia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Direito">⚖️ Direito</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Economia">💰 Economia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Arquitetura">🏗️ Arquitetura</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Engenharia">🧱 Engenharia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Fotografia">📸 Fotografia</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Humor">😂 Humor</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Crônicas">📝 Crônicas</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Contos">📜 Contos</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Ensaios">📚 Ensaios</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Erótico">🔥 Erótico</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="LGBTQIA+">🏳️‍🌈 LGBTQIA+</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Memórias">🕰️ Memórias</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Cartas e Diários">✉️ Cartas e Diários</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Antologias">📖 Antologias</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Didáticos">📗 Didáticos</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="Outros">📘 Outros</option>

                    </motion.select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">
                      Status de Leitura
                    </label>
                    <motion.select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent
                    dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                    wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      aria-label="Selecione o status de leitura do livro"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="não lido">📚 Não Lido</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="quero ler">🎯 Quero Ler</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="lendo">📖 Lendo</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="lido">✅ Lido</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="pausado">⏸️ Pausado</option>
                      <option className="bg-white text-gray-700 dark:bg-slate-600 dark:text-blue-200" value="abandonado">❌ Abandonado</option>
                    </motion.select>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-2 wood:text-primary-800">Avaliação</label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          className="text-2xl hover:scale-110 transition-transform"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          {star <= formData.rating ? (
                            <span className="text-yellow-400">★</span>
                          ) : (
                            <span className="text-gray-300 wood:text-accent-50">★</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <motion.span
                      className="text-sm text-gray-600 dark:text-blue-200 wood:text-primary-800"
                      style={{ marginLeft: '0.5rem' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      key={formData.rating}
                    >
                      {formData.rating === 5 && '⭐⭐⭐⭐⭐ Excelente'}
                      {formData.rating === 4 && '⭐⭐⭐⭐ Muito Bom'}
                      {formData.rating === 3 && '⭐⭐⭐ Bom'}
                      {formData.rating === 2 && '⭐⭐ Regular'}
                      {formData.rating === 1 && '⭐ Ruim'}
                    </motion.span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">ISBN</label>
                  <motion.input
                    name="isbn"
                    type="text"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent
                  dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                  wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    placeholder="Ex: 978-85-359-0277-5"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-800">Informações Técnicas</label>
                  <textarea
                    name="techInfo"
                    value={formData.techInfo}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent resize-none
                  dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                  wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                    style={{ padding: '0.7rem' }}
                    placeholder="Informações técnicas preenchidas automaticamente..."
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-purple-50 rounded-lg dark:bg-blue-200/10 wood:bg-secondary-500"
                style={{ padding: '1rem' }}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 wood:text-accent-400" style={{ marginBottom: '1rem' }}>
                  Capa do Livro
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="cover-url" className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-primary-900">
                    URL da Capa
                  </label>
                  <motion.input
                    id="cover-url"
                    name="cover"
                    type="url"
                    value={formData.cover}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent
                  dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                  wood:bg-accent-50 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                    placeholder="https://exemplo.com/capa-do-livro.jpg"
                    aria-describedby="cover-help"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem', marginBottom: '0.5rem' }}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <p id="cover-help" className="text-xs text-gray-500 dark:text-blue-300 mt-1 wood:text-accent-900">
                    A capa é preenchida automaticamente ou você pode fazer upload abaixo.
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <motion.label
                    htmlFor="cover-upload"
                    className="cursor-pointer inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors
                  dark:bg-purple-500 dark:text-blue-50 wood:bg-accent-500 wood:hover:bg-accent-600"
                    style={{ padding: '0.4rem' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Escolher Arquivo
                  </motion.label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, cover: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {formData.cover && (
                  <motion.div
                    className="flex justify-center mt-4"
                    aria-live="polite"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formData.cover ? (
                        <motion.img
                          src={formData.cover.replace(/^http:\/\//i, 'https://')}
                          alt={`Capa do livro ${formData.title}`}
                          className="w-32 h-48 object-cover rounded-md shadow-md mx-auto"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <p className="text-sm text-gray-500 text-center">
                          Nenhuma capa encontrada 😕
                        </p>
                      )}

                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-green-50 rounded-lg dark:bg-blue-200/10 wood:bg-primary-900"
                style={{ padding: '1rem' }}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 wood:text-accent-400" style={{ marginBottom: '1rem' }}>
                  Conteúdo e Notas
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-accent-200/80">Sinopse</label>
                  <motion.textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent resize-none
                  dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                  wood:bg-primary-100 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                    style={{ padding: '0.7rem' }}
                    placeholder="Preenchido automaticamente (pode editar se quiser)..."
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-400 mb-1 wood:text-accent-200/80">Notas Pessoais</label>
                  <motion.textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm text-gray-500 border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent resize-none
                  dark:bg-blue-200/10 dark:border-blue-200/30 dark:placeholder-blue-200 dark:text-blue-100 dark:focus:ring-blue-300
                  wood:bg-primary-100 wood:border-none wood:focus:ring-primary-300 wood:text-primary-700"
                    style={{ padding: '0.7rem' }}
                    placeholder="Suas observações sobre o livro..."
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-4 wood:text-secondary-900">
                <motion.button
                  type="button"
                  onClick={() => router.back()}
                  className="border border-gray-300 rounded-lg w-25 h-10 hover:bg-gray-100 font-medium cursor-pointer transition-colors
                dark:border-blue-400 dark:text-blue-200 dark:hover:bg-transparent
                wood:bg-accent-500 wood:border-none wood:hover:bg-accent-400"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  className="text-white rounded-lg w-40 h-10 font-medium cursor-pointer transition-colors
                bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600
                wood:from-primary-800 wood:to-primary-900 wood:hover:from-primary-900 wood:hover:to-primary-700"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Adicionar Livro
                </motion.button>
              </motion.div>
            </form>

          )}
        </motion.div>


      </div>
    </motion.div>
  );
}