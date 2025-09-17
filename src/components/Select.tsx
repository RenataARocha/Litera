export default function Select({ children, ...props }) {
  return (
    <select
      className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    >
      {children}
    </select>
  )
}
