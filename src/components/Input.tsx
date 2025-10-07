// components/ui/form/Input.tsx
import React from "react";
import { cn } from "../_lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        // Base (modo claro)
        "border border-gray-200 rounded-xl px-4 py-2 w-full bg-white text-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",

        // Dark mode
        "dark:bg-blue-200/20 dark:text-blue-200 dark:border-transparent",
        "dark:focus:ring-blue-500 dark:placeholder:text-blue-300",

        // Wood mode
        "wood:bg-[var(--color-primary-800)] wood:text-[var(--color-primary-200)]",
        "wood:border-[var(--color-accent-700)] wood:focus:ring-[var(--color-accent-600)]",
        "wood:placeholder:text-[var(--color-primary-400)]",

        className
      )}
      {...props}
    />
  );
};

export default Input;
