import { cn } from "@/lib/utils";

export default function Input(props) {
    return (
        <input
            className={cn(
                "border border-gray-200 rounded-xl px-4 py-2 w-full",
                "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent",
                props.className
            )}
            {...props}
        />
    );
}

export default function Select({ children, className, ...props }) {
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
}