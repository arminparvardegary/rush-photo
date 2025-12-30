import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'rush-red': 'var(--rush-red)',
        'rush-red-dark': 'var(--rush-red-dark)',
        'rush-dark': 'var(--rush-dark)',
        'rush-light': 'var(--rush-light)',
        'rush-gray': 'var(--rush-gray)',
        'rush-gray-light': 'var(--rush-gray-light)',
        'rush-border': 'var(--rush-border)',
        'rush-success': 'var(--rush-success)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
