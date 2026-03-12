import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f5',
          100: '#b3e9e0',
          200: '#80dccb',
          300: '#4dcfb6',
          400: '#1ac2a1',
          500: '#00b58c',
          600: '#009170',
          700: '#006d54',
          800: '#004938',
          900: '#00251c',
        },
      },
    },
  },
  plugins: [],
}
export default config
