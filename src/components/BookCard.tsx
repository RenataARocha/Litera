'use client';

type Book = {
    id: number;
    title: string;
    author: string;
    year: number;
    genre: string;
    rating: number;
    cover?: string;
    description: string;
};

type BookCardProps = {
    book: Book;
};

export default function BookCard({ book }: BookCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 overflow-hidden group">
            {/* Capa do livro */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {book.cover ? (
                    <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-2">📖</div>
                        <span className="text-xs">Sem capa</span>
                    </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Lido
                    </span>
                </div>
                
                {/* Botões de ação no hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                        <span className="text-red-500 text-sm">♥</span>
                    </button>
                </div>
                
                {/* Overlay com informações extras no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
            
            {/* Informações do livro */}
            <div className="p-4">
                {/* Título e autor */}
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">{book.author}</p>
                
                {/* Ano e gênero */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-500 text-xs">{book.year}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {book.genre}
                    </span>
                </div>
                
                {/* Rating com estrelas */}
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <span 
                            key={i} 
                            className={`text-sm ${
                                i < book.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                        ({book.rating}/5)
                    </span>
                </div>
                
                {/* Descrição truncada */}
                <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {book.description}
                </p>
                
                {/* Botões de ação */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                        <span>✏️</span>
                        Editar
                    </button>
                    <button className="bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                        <span>👁️</span>
                    </button>
                    <button className="bg-red-50 text-red-600 py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center">
                        <span>🗑️</span>
                    </button>
                </div>
            </div>
        </div>
    );
}