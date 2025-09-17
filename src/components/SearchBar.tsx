'use client';

type Props = {
    value: string;
    onChange: (val: string) => void;
};

export function SearchBar({ value, onChange}: Props){
    return (
         <input
      type="text"
      placeholder="Buscar por título ou autor..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-2 w-full"
    />
    );
}