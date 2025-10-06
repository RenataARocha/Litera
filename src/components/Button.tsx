import { cn } from "../_lib/utils";
import { ComponentProps, ElementType } from "react";

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: "primary" | "outline" | "ghost" | "danger";
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<T>, "as" | "children" | "className">;

export default function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  return (
    <Component
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all duration-200 transform",
        // ===== VARIANTE PRIMARY =====
        variant === "primary" &&
        "bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl " +
        "dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white " +
        "wood:bg-[#8d6e63] wood:text-[#f3e5ab] wood:hover:bg-[#6d4c41] wood:shadow-lg",

        // ===== VARIANTE OUTLINE =====
        variant === "outline" &&
        "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white " +
        "dark:border-blue-600 dark:text-blue-600 dark:hover:bg-blue-600 dark:hover:text-white " +
        "wood:border-[#5d4037] wood:text-[#3e2723] wood:hover:bg-[#a1887f] wood:hover:text-[#f3e5ab]",

        // ===== VARIANTE GHOST =====
        variant === "ghost" &&
        "bg-transparent text-gray-600 hover:bg-white/20 hover:text-gray-800 " +
        "dark:text-blue-200 dark:hover:bg-blue-500/20 dark:hover:text-white " +
        "wood:text-[#4e342e] wood:hover:bg-[#d7ccc8] wood:hover:text-[#3e2723]",

        // ===== VARIANTE DANGER =====
        variant === "danger" &&
        "bg-red-500 text-white hover:bg-red-600 shadow-md " +
        "dark:bg-red-600 dark:hover:bg-red-700 dark:text-white " +
        "wood:bg-[#a1887f] wood:text-[#3e2723] wood:hover:bg-[#8d6e63]",

        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
