import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F68B1E',
        secondary: '#FFFFFF',
        background: '#F4F4F4',
        'text-primary': '#1A1A1A',
        'text-muted': '#6B7280',
        danger: '#E53935',
        success: '#2E7D32',
        border: '#E5E7EB',
      },
      borderRadius: {
        lg: '6px',
        md: '4px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

 
