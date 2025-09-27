'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function NewBookPage() {
  const router = useRouter();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        year: Number(formData.year),
        pages: Number(formData.pages),
        rating: Number(formData.rating),
      }),
    });
    router.push('/books');
  };

  // Calcula progresso do formulário
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

  // Variantes de animação melhoradas
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      x: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -30,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
  };

  const progressBarVariants: Variants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
      originX: 0
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    },
  };

  const buttonVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Botão Voltar para Home */}
      <motion.div
        style={{ margin: '1rem' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-blue-600 rounded-lg hover:underline transition-colors cursor-pointer"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Voltar para Home
        </motion.button>
      </motion.div>

      <div className="flex items-center justify-center min-h-screen" style={{ margin: '2rem' }}>
        <motion.div
          className="max-w-3xl w-full p-4 bg-white rounded-xl shadow-lg"
          style={{ margin: 'auto', padding: '1rem', boxSizing: 'border-box' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={headerVariants}
            style={{ marginBottom: '1rem' }}
          >
            <motion.h1
              className="text-2xl font-bold text-gray-900"
              style={{ marginBottom: '0.25rem' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Adicionar Novo Livro
            </motion.h1>
            <motion.p
              className="text-sm text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Preencha as informações para catalogar seu livro
            </motion.p>
          </motion.div>

          {/* Barra de progresso */}
          <motion.div variants={itemVariants} className="mb-4">
            <motion.div
              className="w-full bg-gray-200 rounded-full h-4 mb-1"
              role="progressbar"
              aria-valuenow={progress()}
              aria-valuemin={0}
              aria-valuemax={100}
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
              className="text-sm text-gray-700"
              style={{ marginBottom: '1rem', padding: '0.5rem' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {progress()}% preenchido - {progressMessage()}
            </motion.p>
          </motion.div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Informações Obrigatórias */}
            <motion.div
              variants={itemVariants}
              className="bg-red-50 rounded-lg"
              style={{ padding: '1rem' }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-red-800" style={{ marginBottom: '1rem' }}>
                <span className="text-red-500">*</span> Informações Obrigatórias
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    placeholder="Digite o título do livro"
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    placeholder="Digite o autor"
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Informações Adicionais */}
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 rounded-lg"
              style={{ padding: '1rem' }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-blue-800" style={{ marginBottom: '1rem' }}>
                Informações Adicionais
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano de Publicação
                  </label>
                  <motion.input
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    placeholder="Ex: 2023"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total de Páginas
                  </label>
                  <motion.input
                    name="pages"
                    type="number"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    placeholder="Ex: 250"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                  <motion.select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full cursor-pointer px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value="">Selecione</option>
                    <option value="Literatura Brasileira">📚 Literatura Brasileira</option>
                    <option value="Ficção Científica">🚀 Ficção Científica</option>
                    <option value="Realismo Mágico">✨ Realismo Mágico</option>
                    <option value="Ficção">📖 Ficção</option>
                    <option value="Fantasia">🐉 Fantasia</option>
                    <option value="Romance">💕 Romance</option>
                    <option value="Biografia">👤 Biografia</option>
                    <option value="História">🏛️ História</option>
                    <option value="Autoajuda">💪 Autoajuda</option>
                    <option value="Tecnologia">💻 Tecnologia</option>
                    <option value="Programação">⌨️ Programação</option>
                    <option value="Negócios">💼 Negócios</option>
                    <option value="Psicologia">🧠 Psicologia</option>
                    <option value="Filosofia">🤔 Filosofia</option>
                    <option value="Poesia">🎭 Poesia</option>
                  </motion.select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status de Leitura</label>
                  <motion.select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 cursor-pointer text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value="não lido">📚 Não Lido</option>
                    <option value="quero ler">🎯 Quero Ler</option>
                    <option value="lendo">📖 Lendo</option>
                    <option value="lido">✅ Lido</option>
                    <option value="pausado">⏸️ Pausado</option>
                    <option value="abandonado">❌ Abandonado</option>
                  </motion.select>
                </div>
              </div>

              {/* Avaliação */}
              <div style={{ marginTop: '1rem' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
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
                          <span className="text-gray-300">★</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <motion.span
                    className="text-sm text-gray-600"
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

              {/* ISBN e Informações Técnicas */}
              <div style={{ marginTop: '1rem' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <motion.input
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  placeholder="Ex: 978-85-359-0277-5"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Informações Técnicas</label>
                <textarea
                  name="techInfo"
                  value={formData.techInfo}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ padding: '0.7rem' }}
                  placeholder="Preenchimento automático via ISBN no futuro..."
                  readOnly
                />
              </div>
            </motion.div>

            {/* Capa */}
            <motion.div
              variants={itemVariants}
              className="bg-purple-50 rounded-lg"
              style={{ padding: '1rem' }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-purple-800" style={{ marginBottom: '1rem' }}>
                Capa do Livro
              </h3>

              {/* Input de URL */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="cover-url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Capa
                </label>
                <motion.input
                  id="cover-url"
                  name="cover"
                  type="url"
                  value={formData.cover}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://exemplo.com/capa-do-livro.jpg"
                  aria-describedby="cover-help"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <p id="cover-help" className="text-xs text-gray-500 mt-1">
                  Você pode colar a URL da imagem ou fazer upload abaixo.
                </p>
              </div>

              {/* Upload com botão estilizado */}
              <div style={{ marginBottom: '1rem' }}>
                <motion.label
                  htmlFor="cover-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                  style={{ padding: '0.3rem' }}
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

              {/* Preview */}
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
                    <Image
                      src={formData.cover}
                      alt={`Capa do livro: ${formData.title || "Pré-visualização"}`}
                      width={128}
                      height={192}
                      className="object-cover rounded-lg border shadow-md"
                    />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Sinopse e Notas */}
            <motion.div
              variants={itemVariants}
              className="bg-green-50 rounded-lg"
              style={{ padding: '1rem' }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-green-800" style={{ marginBottom: '1rem' }}>
                Conteúdo e Notas
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sinopse</label>
                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ padding: '0.7rem' }}
                  placeholder="Descreva brevemente o enredo do livro..."
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Pessoais</label>
                <motion.textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{ padding: '0.7rem' }}
                  placeholder="Suas observações sobre o livro..."
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>

            {/* Botões */}
            <motion.div variants={itemVariants} className="flex justify-end gap-4 mt-4">
              <motion.button
                type="button"
                onClick={() => router.back()}
                className="border border-gray-300 rounded-lg w-25 h-10 hover:bg-gray-100 font-medium cursor-pointer transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                className=" bg-blue-600 text-white rounded-lg w-40 h-10 bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 font-medium cursor-pointer transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Adicionar Livro
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}