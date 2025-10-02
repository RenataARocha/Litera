export type BookStatus = 'read' | 'reading' | 'to_read' | 'abandoned' | 'paused';

export type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null;
  genre: string | null;
  description: string;
  rating: number;
  cover?: string;
  notes?: string;
  status: string;
  lastRead: string
  isbn?: string
  pages: number;          
  finishedPages: number;
  createdAt: string;
};

export type Color = 'blue' | 'green' | 'purple' | 'orange';

export interface GoalCircleProps {
  percentage: number;
  title: string;
  subtitle?: string;
  color?: Color;
}

export interface Stats {
  totalBooks: number;
  readingNow: number;
  finishedBooks: number;
  totalPagesRead: number;
}

export interface DashboardProps{
  recentActivity: Book[];
  stats: Stats;
}
