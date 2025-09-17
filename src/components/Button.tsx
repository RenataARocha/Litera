import { cn } from "@/lib/utils"

export default function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition',
        variant === 'primary' && 'bg-primary text-white hover:bg-secondary',
        variant === 'outline' && 'border border-primary text-primary hover:bg-primary hover:text-white',
        variant === 'ghost' && 'bg-transparent text-primary hover:bg-primary hover:text-white'
      )}
      {...props}
    >
      {children}
    </button>
  )
}
