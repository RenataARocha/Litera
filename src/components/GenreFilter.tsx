'use client';

type Props = {
  genres: string[];
  value: string;
  onChange: (val: string) => void;
};

export function GenreFilter({ genres, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      <option value="">Todos os gêneros</option>
      {genres.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}