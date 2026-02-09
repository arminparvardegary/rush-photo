import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        handwriting: ['Caveat', 'Comic Sans MS', 'cursive'],
      },
      screens: {
        "xs": "475px",
        "3xl": "1800px",
        "4xl": "2200px",
      },
    },
  },
  plugins: [],
};

export default config;
