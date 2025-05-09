/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1D0F5A',
        'red': '#FF1E1E',
        'gray': '#666666',
        'light-gray': '#F2F2F2',
        'medium-gray': '#DDDDDD',
        'dark-gray': '#777777',
        'red-50': '#FFF5F5',
        'red-100': '#FFEBEB',
        'red-800': '#9B1C1C',
      },
    },
  },
  safelist: [
    'bg-navy',
    'bg-red',
    'text-red',
    'text-navy',
    'border-red',
    'border-t-red',
    'border-l-red',
    'border-l-gray-500',
    'border-l-gray-400',
    'grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
  ],
  plugins: [],
}
