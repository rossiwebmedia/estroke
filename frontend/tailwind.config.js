/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B2A4A',
          50:  '#E6ECF3',
          100: '#C2D0E0',
          600: '#0B2A4A',
          700: '#081F38',
          800: '#061629',
          900: '#040E1B',
        },
        accent: {
          DEFAULT: '#1E88E5',
          50:  '#E3F2FD',
          100: '#BBDEFB',
          400: '#42A5F5',
          500: '#1E88E5',
          600: '#1976D2',
        },
        surface: '#F5F7FA',
        success: { DEFAULT: '#16A34A', 50: '#E8F7EE', 100: '#C6EBD1' },
        warning: { DEFAULT: '#F59E0B', 50: '#FEF3CD', 100: '#FCE8A4' },
        danger:  { DEFAULT: '#DC2626', 50: '#FDECEC', 100: '#F9C7C7' },
      },
      fontFamily: {
        sans: ['Raleway', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 16px -2px rgba(11, 42, 74, 0.08), 0 1px 2px rgba(11, 42, 74, 0.04)',
      },
    },
  },
  plugins: [],
};
