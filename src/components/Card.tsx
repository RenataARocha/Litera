import { cn } from "@/lib/utils";

export default function Card({ children, className, glass = false }) {
    return (
        <div 
            className={cn(
                'bg-surface p-6 rounded-2xl shadow-xl border border-gray-100',
                glass && 'glass-morphism',
                className
            )}
        >
            {children}
        </div>
    );
}