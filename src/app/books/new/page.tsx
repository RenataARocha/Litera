'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBookPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    rating: '',
    cover: '',
    description: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        year: Number(formData.year),
        rating: Number(formData.rating),
      }),
    });

    router.push('/books');
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Novo Livro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-slate-600">Título</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Autor</label>
          <input
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Ano</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Gênero</label>
            <input
              name="genre"
              type="text"
              value={formData.genre}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Avaliação (1-5)</label>
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">URL da Capa (opcional)</label>
          <input
            name="cover"
            type="text"
            value={formData.cover}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white rounded-lg py-2 hover:bg-indigo-600 transition"
        >
          Salvar Livro
        </button>
      </form>
    </div>
  );
}