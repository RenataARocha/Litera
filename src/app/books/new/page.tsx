'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full p-4 bg-white rounded-xl shadow" style={{ margin: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
        {/* Topo com voltar */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.back()}
          style={{ marginBottom: '1rem', gap: '0.5rem' }}
        >
          <FaArrowLeft className="text-blue-700" />
          <span className="text-blue-700 hover:underline">Voltar</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '0.25rem' }}>
            Adicionar Novo Livro
          </h1>
          <p className="text-sm text-gray-900">Preencha as informações para catalogar seu livro</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Informações Obrigatórias */}
          <div className="bg-red-50 rounded-lg" style={{ padding: '1rem' }}>
            <h3 className="text-lg font-semibold text-red-800" style={{ marginBottom: '1rem' }}>
              <span className="text-red-500">*</span> Informações Obrigatórias
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  placeholder="Digite o título do livro"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor <span className="text-red-500">*</span>
                </label>
                <input
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  placeholder="Digite o autor"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-blue-50 rounded-lg" style={{ padding: '1rem' }}>
            <h3 className="text-lg font-semibold text-blue-800" style={{ marginBottom: '1rem' }}>
              Informações Adicionais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano de Publicação
                </label>
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  placeholder="Ex: 2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Páginas
                </label>
                <input
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                  placeholder="Ex: 250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status de Leitura</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                >
                  <option value="quero ler">🎯 Quero Ler</option>
                  <option value="lendo">📖 Lendo</option>
                  <option value="lido">✅ Lido</option>
                  <option value="pausado">⏸️ Pausado</option>
                  <option value="abandonado">❌ Abandonado</option>
                </select>
              </div>
            </div>

            {/* Avaliação */}
            <div style={{ marginTop: '1rem' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl hover:scale-110 transition-transform"
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      {star <= formData.rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">★</span>
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600" style={{ marginLeft: '0.5rem' }}>
                  {formData.rating === 5 && '⭐⭐⭐⭐⭐ Excelente'}
                  {formData.rating === 4 && '⭐⭐⭐⭐ Muito Bom'}
                  {formData.rating === 3 && '⭐⭐⭐ Bom'}
                  {formData.rating === 2 && '⭐⭐ Regular'}
                  {formData.rating === 1 && '⭐ Ruim'}
                </span>
              </div>
            </div>

            {/* ISBN */}
            <div style={{ marginTop: '1rem' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                placeholder="Ex: 978-85-359-0277-5"
              />
            </div>
          </div>

          {/* Capa */}
          <div className="bg-purple-50 rounded-lg" style={{ padding: '1rem' }}>
            <h3 className="text-lg font-semibold text-purple-800" style={{ marginBottom: '1rem' }}>
              Capa do Livro
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Capa</label>
              <input
                name="cover"
                type="url"
                value={formData.cover}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                placeholder="https://exemplo.com/capa-do-livro.jpg"
              />

              {formData.cover && (
                <div className="flex justify-center mt-4">
                  <Image
                    src={formData.cover}
                    alt="Capa do livro"
                    width={128}
                    height={192}
                    className="object-cover rounded-lg border"
                    style={{ margin: '1rem 0' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sinopse e Notas */}
          <div className="bg-green-50 rounded-lg" style={{ padding: '1rem' }}>
            <h3 className="text-lg font-semibold text-green-800" style={{ marginBottom: '1rem' }}>
              Conteúdo e Notas
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sinopse</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ padding: '0.7rem' }}
                placeholder="Descreva brevemente o enredo do livro..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas Pessoais</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ padding: '0.7rem' }}
                placeholder="Suas observações sobre o livro..."
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-300 rounded-lg w-25 h-10 hover:bg-gray-100 font-medium cursor-pointer transition-colors"
      
            >
              Cancelar
            </button>
            <button
              type="submit"
              className=" bg-blue-600 text-white rounded-lg w-40 h-10 bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 font-medium cursor-pointer transition-colors"
            >
              Adicionar Livro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}