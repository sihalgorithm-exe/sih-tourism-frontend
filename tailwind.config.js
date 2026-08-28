/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FAF9F6',
        ink: '#1B2B2B',
        teal: {
          50: '#EAF2F1',
          100: '#CADEDB',
          200: '#9BC0BA',
          400: '#3D726B',
          600: '#0F3D3E',
          700: '#0B2F2F',
          900: '#071E1E',
        },
        gold: {
          100: '#F6E8CE',
          300: '#E4BC79',
          500: '#D4A24E',
          600: '#B8842F',
        },
        clay: {
          100: '#F3DEDF',
          400: '#C1666B',
          600: '#9E4A50',
        },
        sage: {
          100: '#EEF4EE',
          300: '#DCE8DD',
          500: '#B4CBB6',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(15, 61, 62, 0.12)',
      },
    },
  },
  plugins: [],
};
