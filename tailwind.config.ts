import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './docs/**/*.{md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['MyFont', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;