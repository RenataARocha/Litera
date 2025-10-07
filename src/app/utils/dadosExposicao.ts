// src/app/utils/dadosExposicao.ts
// Dados de exposição para usuários não logados

export interface LivroExposicao {
    title: string;
    author: string;
    cover: string;
    status: "Lido" | "Lendo" | "Pausado";
    rating: number; // 0 a 5
    lastRead: string;
    pagesRead: number;
    totalPages: number;
    genre: string;
}

export interface AtividadeExposicao {
    title: string;
    description: string;
    date: string;
}

export interface MetaExposicao {
    title: string;
    percentage: number;
    subtitle: string;
    color: "blue" | "green" | "purple" | "orange";
}

export interface StatsExposicao {
    totalBooks: number;
    readingNow: number;
    finishedBooks: number;
    totalPagesRead: number;
}

// --- Livros de Exposição (5 livros) ---
export const livrosExposicao: LivroExposicao[] = [
    {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        cover: "/covers/placeholder-1.jpg",
        status: "Lido",
        rating: 5,
        lastRead: "01/10/2025",
        pagesRead: 96,
        totalPages: 96,
        genre: "Infantil"
    },
    {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        cover: "/covers/placeholder-2.jpg",
        status: "Lendo",
        rating: 4,
        lastRead: "30/09/2025",
        pagesRead: 120,
        totalPages: 256,
        genre: "Romance"
    },
    {
        title: "1984",
        author: "George Orwell",
        cover: "/covers/placeholder-3.jpg",
        status: "Pausado",
        rating: 4,
        lastRead: "28/09/2025",
        pagesRead: 150,
        totalPages: 328,
        genre: "Distopia"
    },
    {
        title: "Alice no País das Maravilhas",
        author: "Lewis Carroll",
        cover: "/covers/placeholder-4.jpg",
        status: "Lido",
        rating: 5,
        lastRead: "25/09/2025",
        pagesRead: 85,
        totalPages: 85,
        genre: "Fantasia"
    },
    {
        title: "O Hobbit",
        author: "J.R.R. Tolkien",
        cover: "/covers/placeholder-5.jpg",
        status: "Lendo",
        rating: 4,
        lastRead: "29/09/2025",
        pagesRead: 200,
        totalPages: 310,
        genre: "Fantasia"
    },
];


// --- Atividades de Exposição ---
export const atividadesExposicao: AtividadeExposicao[] = [
    {
        title: "Finalizou a leitura de O Pequeno Príncipe",
        description: "Completou todos os capítulos",
        date: "01/10/2025",
    },
    {
        title: "Continuou lendo Dom Casmurro",
        description: "Avançou 30 páginas hoje",
        date: "30/09/2025",
    },
    {
        title: "Pausou a leitura de 1984",
        description: "Marcou como pausado temporariamente",
        date: "28/09/2025",
    },
    {
        title: "Finalizou Alice no País das Maravilhas",
        description: "Avaliou com 5 estrelas",
        date: "25/09/2025",
    },
    {
        title: "Está lendo O Hobbit",
        description: "Progresso constante na aventura",
        date: "29/09/2025",
    },
];

// --- Metas de Exposição ---
export const metasExposicao: MetaExposicao[] = [
    {
        title: "Livros por Ano",
        percentage: 20,
        subtitle: "10 de 50 livros",
        color: "blue",
    },
    {
        title: "Páginas por Mês",
        percentage: 40,
        subtitle: "800 de 2000 páginas",
        color: "green",
    },
    {
        title: "Gêneros Diversos",
        percentage: 50,
        subtitle: "5 de 10 gêneros",
        color: "purple",
    },
];

// --- Estatísticas Calculadas dos Livros de Exposição ---
export const statsExposicao: StatsExposicao = {
    totalBooks: livrosExposicao.length, // 5 livros
    readingNow: livrosExposicao.filter(l => l.status === "Lendo").length, // 2 livros
    finishedBooks: livrosExposicao.filter(l => l.status === "Lido").length, // 2 livros
    totalPagesRead: livrosExposicao.reduce((acc, l) => acc + l.pagesRead, 0), // 651 páginas
};

// --- Função auxiliar para converter dados de exposição para o formato esperado ---
export const formatLivrosParaAtividade = () => {
    return livrosExposicao.map(livro => ({
        title: livro.title,
        author: livro.author,
        cover: livro.cover,
        status: livro.status,
        rating: livro.rating,
        lastRead: livro.lastRead,
    }));
};