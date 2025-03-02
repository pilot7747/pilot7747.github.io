/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Enable dark mode that works with class
  darkMode: 'class',
  // Explicitly include common color utilities in Tailwind 4
  safelist: [
    'bg-white',
    'bg-slate-900',
    'text-white',
    'text-slate-900',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-50',
    'bg-slate-800',
    'border-gray-200',
    'border-gray-700',
    'text-primary-600',
    'text-primary-400',
    'bg-gray-50',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        light: '#f7fafc',
        'light-50': '#f9fafb',
        'light-100': '#f3f4f6',
        'light-200': '#e5e7eb',
        dark: '#1a202c',
        'dark-50': '#2d3748',
        'dark-100': '#1a202c',
        'dark-200': '#171923',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
} 