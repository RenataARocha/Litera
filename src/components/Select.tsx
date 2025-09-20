// components/ui/form/Select.tsx
import React from "react";
import { cn } from "../_lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children?: React.ReactNode;
};

const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  return (
    <select
      className={cn(
        "border border-gray-200 rounded-xl px-4 py-2 w-full",
        "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
