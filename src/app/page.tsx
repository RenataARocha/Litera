import Card from "@/components/Card";
import BookCard from "@/components/BookCard";

// Dados de exemplo para o BookCard
const exampleBook = {
    id: 1,
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    year: 1954,
    genre: "Fantasia",
    rating: 5,
    cover: "",
    description: "Um hobbit chamado Frodo Baggins herda um anel e embarca em uma jornada perigosa para destruí-lo e salvar a Terra Média do Senhor das Trevas Sauron."
};

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-primary-500 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
                Bem-vindo à sua biblioteca digital
            </h1>
            
            {/* Exemplo de uso do BookCard com o novo design */}
            <div className="max-w-xs w-full">
                <BookCard book={exampleBook} />
            </div>

            {/* Exemplo de uso do Card simples */}
            <Card>
                <p>Este é um exemplo de Card para qualquer conteúdo.</p>
            </Card>
        </div>
    );
}