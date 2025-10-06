'use client';

type StarRatingProps = {
    rating: number;
    size?: 'small' | 'large';
    showNumber?: boolean;
};

export default function StarRating({ rating, size = 'small', showNumber = false }: StarRatingProps) {
    const starSize = size === 'small' ? 14 : 16;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                width={starSize}
                height={starSize}
                viewBox="0 0 24 24"
                fill={index < rating ? "#fbbf00" : "#e5e7eb"}
                className="drop-shadow-sm"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    return (
        <div className="flex items-center gap-1">
            {renderStars(rating)}
            {showNumber && (
                <span className="text-sm text-gray-600 dark:text-blue-200" style={{ marginLeft: '0.5rem' }}>
                    ({rating}/5)
                </span>
            )}
        </div>
    );
}