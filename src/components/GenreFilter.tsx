'use client';

type GenreFilterProps = {
  genres: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function GenreFilter({ value, onChange }: GenreFilterProps) {
  return (
    <div className="relative">


      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-50 h-12 text-left rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 min-w-[180px] appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300"
        style={{ padding: '0.5rem' }}>
        <option value=""> 🏷️ Todos os Gêneros</option>
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

      {/* Seta customizada */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Indicador de filtro ativo */}
      {value && (
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}