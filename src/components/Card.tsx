import { cn } from "../_lib/utils";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  glass?: boolean;
};

export default function Card({ children, className, glass = false }: CardProps) {
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
