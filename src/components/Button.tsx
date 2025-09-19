import { cn } from "../_lib/utils";

export default function Button({ as, variant = 'primary', children, className, ...props }) {
  const Component = as || 'button';

  return (
    <Component
      className={cn(
        'px-4 py-2 rounded-xl font-medium transition-all duration-200 transform',
        variant === 'primary' && 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl',
        variant === 'outline' && 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
        variant === 'ghost' && 'bg-transparent text-gray-600 hover:bg-white/20 hover:text-gray-800',
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
