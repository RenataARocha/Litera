export type BookStatus = 'read' | 'reading' | 'to_read' | 'abandoned' | 'paused';

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  rating: number;
  cover?: string;
  description: string;
  notes?: string; 
  status: BookStatus;
};
