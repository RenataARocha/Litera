import type { Book, Stats } from '@/components/types/types';
import { prisma } from '@/_lib/prisma';


function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return years + (years === 1 ? " ano atrás" : " anos atrás");
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return months + (months === 1 ? " mês atrás" : " meses atrás");
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return days + (days === 1 ? " dia atrás" : " dias atrás");
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return hours + (hours === 1 ? " hora atrás" : " horas atrás");
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return minutes + (minutes === 1 ? " minuto atrás" : " minutos atrás");
  }
  return "agora";
}

export async function getDashboardData(): Promise<{ recentActivity: Book[], stats: Stats }> {
  const dbBooks = await prisma.book.findMany({
    include: { author: true },
    orderBy: { updatedAt: 'desc' }
  });


  const totalBooks = dbBooks.length;
  const readingNow = dbBooks.filter(b => b.status == "READING").length;
  const finishedBooks = dbBooks.filter(b => b.status == "READ").length;

  const totalPagesRead = dbBooks
    .filter(b => b.status === "READ")
    .reduce((sum, b) => {
      return sum + b.pages;
    }, 0);

  const stats = {
    totalBooks: totalBooks,
    readingNow: readingNow,
    finishedBooks: finishedBooks,
    totalPagesRead: totalPagesRead,
  };

  const recentActivity: Book[] = dbBooks
    .slice(0, 5)
    .map((b) => {
      let statusPt: Book['status'];

      switch (b.status) {
        case "READ":
          statusPt = "Lido";
          break;
        case "READING":
          statusPt = "Lendo";
          break;
        case "TO_READ":
          statusPt = "Quero ler";
          break;
        case "PAUSED":
          statusPt = "Pausado";
          break;
        case "ABANDONED":
          statusPt = "Abandonado";
          break;
        default:
          statusPt = "Desconhecido";
      }

      const ratingMap: Record<string, number> = {
        "FIVE_STARS": 5, "FOUR_STARS": 4, "THREE_STARS": 3,
        "TWO_STARS": 2, "ONE_STAR": 1
      }

      const lastReadDate = new Date(b.updatedAt);
      const timeAgo = formatTimeAgo(lastReadDate);

      return {
        title: b.title,
        author: b.author.name,
        status: statusPt,
        genre: b.genre,
        description: b.description,

        rating: b.rating ? ratingMap[b.rating] : 0,
        lastRead: timeAgo,
        cover: b.cover,
      } as Book;


    });

  return { recentActivity, stats }
}
