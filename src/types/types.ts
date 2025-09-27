export type BookStatus = 'read' | 'reading' | 'to_read' | 'abandoned' | 'paused';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number | null;
  genre: string | null;
  description: string;
  rating: number;
  cover?: string;
  notes?: string;
  status: string;
  lastRead?: string
};
