import { PrismaClient, BookStatus, BookRating } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seed...");

  // Criar autores e pegar os IDs
  const authorsData = [
    'George R. R. Martin',
    'J. R. R. Tolkien',
    'George Orwell',
    'J. K. Rowling',
    'Machado de Assis',
  ];

  const authors: Record<string, number> = {};

  for (const name of authorsData) {
    const author = await prisma.author.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    authors[name] = author.id; // salvar o ID real do autor
  }

  console.log("Autores criados.");

  // Criar livros usando os IDs corretos
  const booksData = [
    {
      title: 'A Guerra dos Tronos',
      year: 1996,
      pages: 694,
      genre: 'Fantasia',
      status: BookStatus.READ,
      rating: BookRating.FIVE_STARS,
      cover: 'url_da_capa_1',
      isbn: '978-85-8041-356-2',
      description: 'Primeiro livro da série As Crônicas de Gelo e Fogo.',
      notes: null,
      authorName: 'George R. R. Martin',
    },
    {
      title: 'O Senhor dos Anéis',
      year: 1954,
      pages: 1178,
      genre: 'Fantasia',
      status: BookStatus.READING,
      rating: BookRating.FIVE_STARS,
      cover: 'url_da_capa_2',
      isbn: '978-85-3330-221-5',
      description: 'A épica jornada de Frodo Bolseiro.',
      notes: 'Começando a releitura.',
      authorName: 'J. R. R. Tolkien',
    },
    {
      title: '1984',
      year: 1949,
      pages: 328,
      genre: 'Distopia',
      status: BookStatus.TO_READ,
      rating: BookRating.FIVE_STARS,
      cover: 'url_da_capa_3',
      isbn: '978-85-3590-942-0',
      description: 'Um clássico sobre totalitarismo.',
      notes: null,
      authorName: 'George Orwell',
    },
    {
      title: 'Harry Potter e a Pedra Filosofal',
      year: 1997,
      pages: 223,
      genre: 'Fantasia',
      status: BookStatus.READ,
      rating: BookRating.FOUR_STARS,
      cover: 'url_da_capa_4',
      isbn: '978-85-3251-101-0',
      description: 'O início da saga do bruxo mais famoso.',
      notes: null,
      authorName: 'J. K. Rowling',
    },
    {
      title: 'Dom Casmurro',
      year: 1899,
      pages: 256,
      genre: 'Romance',
      status: BookStatus.READ,
      rating: BookRating.FOUR_STARS,
      cover: 'url_da_capa_5',
      isbn: '978-85-8285-060-0',
      description: 'Machado de Assis e a dúvida sobre Capitu.',
      notes: 'Onde está a traição?',
      authorName: 'Machado de Assis',
    },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        title: book.title,
        year: book.year,
        pages: book.pages,
        genre: book.genre,
        status: book.status,
        rating: book.rating,
        cover: book.cover,
        isbn: book.isbn,
        description: book.description,
        notes: book.notes,
        authorId: authors[book.authorName],
      },
    });
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
