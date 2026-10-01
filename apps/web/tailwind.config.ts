import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070b14',
        panel: '#101826',
        accent: '#7dd3fc',
      },
    },
  },
  plugins: [],
};

export default config;
