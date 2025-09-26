'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { Book } from '@/types/types';
import Timer from "./TimerBook";

type BookCardProps = {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
};

export default function BookCard({ book, onDelete }: BookCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para obter as cores e texto de cada status
  const getStatusConfig = (status: string) => {
    const configs = {

      'lido': {
        text: "Lido",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      },
      'lendo': {
        text: "Lendo",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
      },
      'pausado': {
        text: "Pausado",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      },
      'quero ler': {
        text: "Quero Ler",
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
      },
      'abandonado': {
        text: "Abandonado",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      }
    };

    const normalizedStatus = status.toLowerCase();

    // Agora, a função vai procurar por "lido", "lendo", etc.
    return configs[normalizedStatus as keyof typeof configs] || configs['abandonado'];
  };

  const statusConfig = getStatusConfig(book.status);

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={index < rating ? "#fbbf24" : "#e5e7eb"}
        className="drop-shadow-sm"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete) onDelete(book.id);
    setShowDeleteModal(false);
  };

  const [coverUrl] = useState(book.cover || "");
  function PersonalNotes() {
    const [notes, setNotes] = useState("");

    useEffect(() => {
      const savedNotes = localStorage.getItem("personalNotes");
      if (savedNotes) setNotes(savedNotes);
    }, []);

    useEffect(() => {
      localStorage.setItem("personalNotes", notes);
    }, [notes]);

    return (
      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        style={{ padding: '0.7rem' }}
        placeholder="Escreva suas notas pessoais..."
      />
    );
  }


  return (
    <>
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl/20 transition-all duration-200 hover:-translate-y-3">
        {/* Área da capa do livro */}
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={book.title}
              width={200}
              height={200}
              className="w-full h-full object-contain"
            />
          ) : (

            <div className="flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                </svg>
              </div>
              <span className="text-xs text-center">Sem capa</span>
            </div>
          )}

          {/* Status no canto superior esquerdo sem borda */}
          <span className={`absolute top-2 left-2 ${statusConfig.bgColor} ${statusConfig.textColor} text-[10px] rounded-full shadow-sm font-medium`} style={{ padding: '0.3rem' }}>
            {statusConfig.text}
          </span>

          {/* Rating com estrela no canto superior direito */}
          <div className="absolute w-8 top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full shadow" style={{ padding: '0.3rem' }}>
            <svg
              width="16"
              height="14"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              className="drop-shadow-sm"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs text-gray-700 font-medium">{book.rating}</span>
          </div>
        </div>

        {/* Informações do livro */}
        <div style={{ padding: '2rem', lineHeight: '3rem' }}>

          {/* Título */}
          <h3 className="font-bold text-gray-900 text-base leading-tight" style={{ marginBottom: '0.3rem' }}>
            {book.title}
          </h3>

          {/* Autor */}
          <p className="text-gray-600 text-xs" style={{ marginBottom: '0.4rem' }}>{book.author}</p>

          {/* Ano e Páginas */}
          <div className="flex items-center gap-32 text-sm text-gray-400 mb-3">
            <span>📅 {book.year}</span>
            <span>📄 250p</span>
          </div>

          {/* Gênero com fundo azul claro */}
          <div className="mb-4">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm px-2 py-1 w-full text-center rounded font-medium">
              {book.genre}
            </span>
          </div>

          {/* Estrelas */}
          <div className="flex items-center gap-1" style={{ marginBottom: '0.5rem' }}>
            {renderStars(book.rating)}
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 bg-blue-50 text-blue-600 rounded-md h-8 text-sm cursor-pointer font-medium hover:bg-blue-100 transition-colors px-3 py-2.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" />
              </svg>
              Detalhes
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 bg-gray-50 text-gray-600 rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-100 transition-colors px-3 py-2.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3-6.5 6.5-.5 3 3-.5 6.5-6.5z" />
              </svg>
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-600 w-8 cursor-pointer rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center justify-center px-3 py-2.5"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetailsModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Header com botão fechar */}
              <div style={{ margin: '1rem' }}>

                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

              </div>

              {/* Seção superior: Capa e Informações lado a lado */}
              <div className="flex gap-6 mb-6 bg-blue-100 rounded-lg " style={{ padding: '2rem', margin: '1rem' }}>
                {/* Capa do livro */}
                <div className="flex-shrink-0">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={book.title}
                      width={150}
                      height={200}
                      className="rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-[150px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Informações do livro */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-gray-600 text-lg">{book.author}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {renderStars(book.rating)}
                      <span className="ml-2 text-sm text-gray-600">({book.rating}/5)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Ano:</span>
                        <p className="text-gray-600">{book.year}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Páginas:</span>
                        <p className="text-gray-600">250p</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Gênero:</span>
                        <p className="text-gray-600">{book.genre}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ml-1 ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          {statusConfig.text}
                        </span>
                      </div>
                    </div>

                    {/* Botões de ação com fundo azul */}
                    <div className=" rounded-lg p-4 mt-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            setShowEditModal(true);
                          }}
                          className="flex-1 cursor-pointer bg-blue-600 text-white py-2 px-4 h-8 rounded-md hover:bg-gradient-to-r from-blue-500 to-blue-900 transition-colors flex items-center justify-center gap-2"
                          style={{ marginTop: '1rem' }}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3-6.5 6.5-.5 3 3-.5 6.5-6.5z" />
                          </svg>
                          Editar Livro
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 cursor-pointer bg-red-600 text-white py-2 px-4 h-8 rounded-lg hover:bg-gradient-to-r from-red-500 to-red-700 transition-colors flex items-center justify-center gap-2"
                          style={{ marginTop: '1rem' }}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>
                          Excluir
                        </button>
                      </div> <Timer bookId={book.id} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seções de conteúdo */}
              <div className="bg-white/50 rounded-lg " style={{ padding: '1rem', margin: '1rem' }}>
                {/* Sinopse */}
                <div className="bg-violet-100 rounded-lg p-4" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <div className="flex items-center gap-2 mb-3" style={{ marginBottom: '0.7rem' }}>
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                    <h4 className="font-semibold text-purple-800 text-lg">Sinopse</h4>
                  </div>
                  <p className="text-black text-sm leading-relaxed">{book.description}</p>
                </div>

                {/* Notas Pessoais */}
                <div className="bg-green-100 rounded-lg p-4" style={{ padding: '1rem', marginBottom: '1rem' }}>
                  <div className="flex items-center gap-2 mb-3" style={{ marginBottom: '0.7rem' }}>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    <h4 className="font-semibold text-green-800 text-lg">Notas Pessoais</h4>
                  </div>
                  <p className="text-black0 text-sm leading-relaxed">
                    Uma obra-prima da literatura brasileira que explora temas universais como amor, ciúme e memória. A narrativa envolvente de Machado de Assis revela camadas profundas da natureza humana através dos olhos de Bentinho.
                  </p>
                </div>

                {/* Informações Técnicas */}
                <div className="bg-fuchsia-100 rounded-lg p-4" style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-2 mb-3" style={{ marginBottom: '0.7rem' }}>
                    <svg className="w-5 h-5 text-fuchsia-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h4 className="font-semibold text-fuchsia-800 text-lg">Informações Técnicas</h4>
                  </div>
                  <div className="text-black text-sm space-y-1">
                    <p><span className="font-medium">Editora:</span> Companhia das Letras</p>
                    <p><span className="font-medium">ISBN:</span> 978-85-359-0277-5</p>
                    <p><span className="font-medium">Idioma:</span> Português</p>
                    <p><span className="font-medium">Data de leitura:</span> Março 2024</p>
                  </div>
                </div>
              </div>

              {/* Botão Fechar */}
              <div className="flex justify-center" style={{ marginBottom: '1rem' }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-white cursor-pointer text-gray-700 font-bold py-2 px-6 rounded-lg w-18 hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
          style={{ padding: "1rem" }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ margin: "2rem" }}
          >
            <div style={{ padding: "1.5rem" }}>
              {/* Header */}
              <div
                className="flex justify-between items-center"
                style={{ marginBottom: "1.5rem" }}
              >
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900">Editar Livro</h2>
                  <p className="text-sm text-gray-900" >Preencha as informações para catalogar seu livro</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                {/* Informações Obrigatórias */}
                <div className="bg-red-50 rounded-lg" style={{ padding: "1rem" }}>
                  <h3
                    className="text-lg font-semibold text-red-800"
                    style={{ marginBottom: "1rem" }}
                  >
                    <span className="text-red-500">*</span> Informações Obrigatórias
                  </h3>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Livro <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue={book.title}
                        className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                        placeholder="Digite o título do livro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue={book.author}
                        className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                        placeholder="Digite o nome do autor"
                      />
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-blue-50 rounded-lg" style={{ padding: "1rem" }}>
                  <h3
                    className="text-lg font-semibold text-blue-800"
                    style={{ marginBottom: "1rem" }}
                  >
                    Informações Adicionais
                  </h3>
                  <div
                    className="grid grid-cols-2 gap-4"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano de Publicação
                      </label>
                      <input
                        type="number"
                        defaultValue={book.year ?? undefined }
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
                        type="number"
                        defaultValue="250"
                        className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                        placeholder="Ex: 300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gênero
                      </label>
                      <select
                        defaultValue={book.genre ?? undefined}
                        className="w-full cursor-pointer px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      >
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status de Leitura
                      </label>
                      <select
                        defaultValue={book.status}
                        className="w-full cursor-pointer px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      >
                        <option value="não lido">📚 Não Lido</option>
                        <option value="quero ler">🎯 Quero Ler</option>
                        <option value="lendo">📖 Lendo</option>
                        <option value="lido">✅ Lido</option>
                        <option value="pausado">⏸️ Pausado</option>
                        <option value="abandonado">❌ Abandonado</option>
                      </select>
                    </div>
                  </div>

                  {/* Avaliação com Estrelas */}
                  <div style={{ marginTop: "1rem" }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avaliação
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="text-2xl hover:scale-110 transition-transform"
                          >
                            {star <= book.rating ? (
                              <span className="text-yellow-400">★</span>
                            ) : (
                              <span className="text-gray-300">★</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600" style={{ marginLeft: "0.5rem" }}>
                        {book.rating === 5 && "⭐⭐⭐⭐⭐ Excelente"}
                        {book.rating === 4 && "⭐⭐⭐⭐ Muito Bom"}
                        {book.rating === 3 && "⭐⭐⭐ Bom"}
                        {book.rating === 2 && "⭐⭐ Regular"}
                        {book.rating === 1 && "⭐ Ruim"}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      placeholder="Ex: 978-85-359-0277-5"
                    />
                  </div>
                </div>

                {/* Capa do Livro */}

                <div className="bg-purple-50 rounded-lg" style={{ padding: "1rem" }}>
                  <h3
                    className="text-lg font-semibold text-purple-800"
                    style={{ marginBottom: "1rem" }}
                  >
                    Capa do Livro
                  </h3>
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Capa
                    </label>
                    <input
                      type="url"
                      defaultValue={book.cover}
                      className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ padding: '0.3rem', paddingLeft: '0.7rem' }}
                      placeholder="https://exemplo.com/capa-do-livro.jpg"
                    />

                    <p className="text-xs text-gray-500" style={{ marginTop: "0.25rem" }}>
                      Cole aqui o link da imagem da capa do livro
                    </p>


                    {/* Preview da capa */}
                    {coverUrl && (
                      <div className="flex justify-center mt-8">
                        <Image
                          src={coverUrl}
                          alt="Capa do livro"
                          width={128}
                          height={192}
                          className="object-cover rounded-lg border"
                          style={{ margin: '1.5rem 0' }}
                        />
                      </div>
                    )}

                  </div>
                </div>

                {/* Conteúdo e Notas */}
                <div className="bg-green-50 rounded-lg" style={{ padding: "1rem" }}>
                  <h3
                    className="text-lg font-semibold text-green-800"
                    style={{ marginBottom: "1rem" }}
                  >
                    Conteúdo e Notas
                  </h3>

                  {/* Campo Sinopse */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sinopse
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={book.description} // já vem preenchido
                      className="w-full px-3 py-2 text-sm border bg-white/90 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      style={{ padding: '0.7rem' }}
                      placeholder="Descreva brevemente o enredo do livro..."
                    />
                  </div>

                  {/* Campo Notas Pessoais */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Pessoais
                    </label>
                    <PersonalNotes />
                  </div>
                </div>

                {/* Botões de Ação */}
                <div
                  className="flex gap-3 border-t border-gray-200"
                  style={{ paddingTop: "1rem" }}
                >
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 cursor-pointer h-9 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Salvando alterações...");
                      setShowEditModal(false);
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 hover:from-blue-500 hover:to-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="flex items-center justify-center z-50" style={{ position: 'fixed', inset: 0 }}>
          <div
            className="bg-white rounded-xl shadow-lg"
            style={{ padding: '1.5rem', maxWidth: '24rem', width: '100%' }}
          >
            <div className="text-center">
              <div
                className="mx-auto flex items-center justify-center rounded-full mb-4"
                style={{ height: '3rem', width: '3rem', backgroundColor: '#fee2e2' }}
              >
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excluir Livro</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tem certeza que deseja excluir &quot;{book.title}&quot;? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 cursor-pointer bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 cursor-pointer bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}