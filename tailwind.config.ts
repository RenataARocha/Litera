import lineClamp from '@tailwindcss/line-clamp'; // 💡 Use 'import' em vez de 'require'

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    // 💡 Use a variável importada:
    lineClamp,
  ],
};

export default config;