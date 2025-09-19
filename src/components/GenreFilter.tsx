'use client';

type GenreFilterProps = {
  genres: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function GenreFilter({ genres, value, onChange }: GenreFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="">Todos os gêneros</option>
      {genres.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}
