// logic.tsx
import Home from './home';
import type { Book } from '@/types/types';
import { prisma } from '@/_lib/db'; // client do banco


export default async function Logic() {
  const dbBooks = await prisma.book.findMany({
    include: { author: true },
  });

  const recentActivity: Book[] = dbBooks.map((b) => {
    let statusPt: string;

    switch(b.status){
      case "READ":
      statusPt = "Lido";
      break;
    case "READING":
      statusPt = "Lendo";
      break;
    case "TO_READ":
      statusPt = "Quero ler";
      break;
    default:
      statusPt = "Desconhecido";
    }
    return {
    id: b.id,
    title: b.title,
    author: b.author.name,
    year: b.year,
    genre: b.genre,
    description: b.description,
    status: statusPt,
    rating:
      b.rating === "FIVE_STARS" ? 5 :
      b.rating === "FOUR_STARS" ? 4 :
      b.rating === "THREE_STARS" ? 3 :
      b.rating === "TWO_STARS" ? 2 :
      b.rating === "ONE_STAR" ? 1 : 0,
    cover: b.cover,
    notes: b.notes ?? undefined
    }
});

  return <Home recentActivity={recentActivity} />;
}
