'use client';
import Image from "next/image";

type BookCoverProps = {
    cover?: string;
    title: string;
    height?: string;
    width?: number;
    imageHeight?: number;
};

export default function BookCover({
    cover,
    title,
    height = "h-48",
    width = 200,
    imageHeight = 200
}: BookCoverProps) {
    return (
        <div
            className={`
                relative ${height} 
                bg-gray-100 flex items-center justify-center 
                dark:bg-blue-200/30 
                wood:bg-[var(--color-primary-700)] 
                
            `}
        >
            {cover ? (
                <Image
                    src={cover}
                    alt={title}
                    width={width}
                    height={imageHeight}
                    className="w-full h-full object-contain"
                />
            ) : (
                <div
                    className="
                        flex flex-col items-center justify-center text-gray-400 
                        dark:text-blue-200 
                        wood:text-[var(--color-accent-400)]
                    "
                >
                    <div
                        className="w-12 h-12 flex items-center justify-center"
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm8 7V3.5L18.5 9H14z" />
                        </svg>
                    </div>
                    <span
                        className="
                            text-xs text-center text-gray-400
                            dark:text-blue-200
                            wood:text-[var(--color-primary-200)]
                        "
                    >
                        Sem capa
                    </span>
                </div>
            )}
        </div>
    );
}
