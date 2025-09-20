// components/ui/form/Input.tsx
import React from "react";
import { cn } from "../_lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "border border-gray-200 rounded-xl px-4 py-2 w-full",
        "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent",
        className
      )}
      {...props}
    />
  );
};

export default Input;
